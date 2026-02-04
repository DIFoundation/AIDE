-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable PostGIS for geospatial queries (optional but recommended)
-- create extension if not exists postgis;

-- USERS TABLE (linked to Supabase Auth)
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  role text check (role in ('ADMIN','VOLUNTEER','USER')) default 'USER',
  verified boolean default false,
  organization text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RESOURCES TABLE
create table resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('SHELTER','FOOD','MEDICAL','WATER','CLOTHING','OTHER')),
  status text not null check (status in ('AVAILABLE','LIMITED','UNAVAILABLE','TEMPORARILY_CLOSED')) default 'AVAILABLE',
  description text,
  verified boolean default false,
  capacity integer,
  current_occupancy integer default 0,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  address text,
  city text,
  country text,
  phone text,
  email text,
  operating_hours text,
  notes text,
  submitted_by uuid references users(id) on delete set null,
  verified_by uuid references users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ALERTS TABLE
create table alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  severity text not null check (severity in ('INFO','WARNING','DANGER','CRITICAL')) default 'INFO',
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  radius_km numeric default 10,
  address text,
  affected_areas text[],
  instructions text,
  active boolean default true,
  start_time timestamp with time zone default now(),
  end_time timestamp with time zone,
  created_by uuid references users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- SUBMISSIONS TABLE
create table submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('NEW_RESOURCE','RESOURCE_UPDATE','REPORT')),
  resource_id uuid references resources(id) on delete cascade,
  data jsonb not null,
  submitted_by uuid references users(id) on delete cascade,
  status text not null check (status in ('PENDING','APPROVED','REJECTED')) default 'PENDING',
  reviewed_by uuid references users(id) on delete set null,
  review_notes text,
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

-- INDEXES for better query performance
create index idx_resources_type on resources(type);
create index idx_resources_status on resources(status);
create index idx_resources_verified on resources(verified);
create index idx_resources_location on resources(latitude, longitude);
create index idx_alerts_active on alerts(active);
create index idx_alerts_severity on alerts(severity);
create index idx_alerts_location on alerts(latitude, longitude);
create index idx_submissions_status on submissions(status);
create index idx_submissions_type on submissions(type);
create index idx_submissions_submitted_by on submissions(submitted_by);

-- TRIGGERS for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on users
  for each row execute function update_updated_at_column();

create trigger update_resources_updated_at before update on resources
  for each row execute function update_updated_at_column();

create trigger update_alerts_updated_at before update on alerts
  for each row execute function update_updated_at_column();

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table users enable row level security;
alter table resources enable row level security;
alter table alerts enable row level security;
alter table submissions enable row level security;

-- Users policies
create policy "Users can view their own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can view all users"
  on users for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'ADMIN'
    )
  );

create policy "Admins can update any user"
  on users for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'ADMIN'
    )
  );

-- Resources policies
create policy "Anyone can view verified resources"
  on resources for select
  using (verified = true or auth.uid() is not null);

create policy "Authenticated users can create resources"
  on resources for insert
  with check (auth.uid() is not null);

create policy "Admins and volunteers can update resources"
  on resources for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() 
      and users.role in ('ADMIN', 'VOLUNTEER')
    )
  );

create policy "Admins can delete resources"
  on resources for delete
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'ADMIN'
    )
  );

-- Alerts policies
create policy "Anyone can view active alerts"
  on alerts for select
  using (active = true or auth.uid() is not null);

create policy "Admins and volunteers can create alerts"
  on alerts for insert
  with check (
    exists (
      select 1 from users
      where users.id = auth.uid() 
      and users.role in ('ADMIN', 'VOLUNTEER')
    )
  );

create policy "Admins and volunteers can update alerts"
  on alerts for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() 
      and users.role in ('ADMIN', 'VOLUNTEER')
    )
  );

create policy "Admins can delete alerts"
  on alerts for delete
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'ADMIN'
    )
  );

-- Submissions policies
create policy "Users can view their own submissions"
  on submissions for select
  using (submitted_by = auth.uid());

create policy "Admins and volunteers can view all submissions"
  on submissions for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() 
      and users.role in ('ADMIN', 'VOLUNTEER')
    )
  );

create policy "Authenticated users can create submissions"
  on submissions for insert
  with check (auth.uid() is not null and submitted_by = auth.uid());

create policy "Admins and volunteers can update submissions"
  on submissions for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() 
      and users.role in ('ADMIN', 'VOLUNTEER')
    )
  );

-- FUNCTION to automatically create user profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'USER')
  );
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER to create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- FUNCTION to check if alert affects a location
create or replace function is_location_in_alert_radius(
  alert_lat numeric,
  alert_lng numeric,
  alert_radius numeric,
  check_lat numeric,
  check_lng numeric
)
returns boolean as $$
declare
  distance numeric;
begin
  -- Haversine formula to calculate distance
  distance := 2 * 6371 * asin(sqrt(
    power(sin(radians(check_lat - alert_lat) / 2), 2) +
    cos(radians(alert_lat)) * cos(radians(check_lat)) *
    power(sin(radians(check_lng - alert_lng) / 2), 2)
  ));
  
  return distance <= alert_radius;
end;
$$ language plpgsql;