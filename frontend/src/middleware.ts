import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Role = 'USER' | 'VOLUNTEER' | 'ADMIN';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Get the token from the cookies
  const token = request.cookies.get('authToken')?.value;
  const userData = request.cookies.get('data')?.value as { user: { role: Role } } | undefined;

  // console.log('token: ', token);
  console.info('userData: ' + userData);

  // If no token, redirect to login
  if (!token) {
    if (path !== '/user') {
      const loginUrl = new URL('/user', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (!userData) {
    return NextResponse.redirect(new URL('/user', request.url));
  } else if (userData.user?.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/(role)/admin', request.url));
  } else if (userData.user?.role === 'VOLUNTEER') {
    return NextResponse.redirect(new URL('/(role)/volunteer', request.url));
  } else if (userData.user?.role === 'USER') {
    return NextResponse.redirect(new URL('/map', request.url));
  }

  // // If user is logged in and tries to access login page, redirect to appropriate dashboard
  // if (path === '/user') {
  //   return handleRoleBasedRedirect(userData?.user?.role, request);
  // }

  // Handle role-based routing
  if (path.startsWith('/(role)')) {
    const pathRole = path.split('/')[2]?.toUpperCase();
    
    // If the path doesn't match the user's role, redirect to the correct dashboard
    if (pathRole !== userData?.user.role) {
      return handleRoleBasedRedirect(userData?.user.role, request);
    }
  }

  return NextResponse.next();
}

function handleRoleBasedRedirect(role: Role | undefined, request: NextRequest) {
  const baseUrl = new URL('/', request.url);
  
  switch (role) {
    case 'ADMIN':
      return NextResponse.redirect(new URL('/(role)/admin', request.url));
    case 'VOLUNTEER':
      return NextResponse.redirect(new URL('/(role)/volunteer', request.url));
    case 'USER':
      return NextResponse.redirect(new URL('/map', request.url));
    default:
      // If no role is found, redirect to landing page
      return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
