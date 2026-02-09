'use client'
import React, { useState, useEffect } from 'react';
import { MapPin, Filter, ShieldCheck, Heart, Users, Droplet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function LiveTimer() {
  const [timeAgo, setTimeAgo] = useState('a few seconds');
  
  useEffect(() => {
    const updateTime = () => {
      const minutes = Math.floor(Math.random() * 5) + 1;
      setTimeAgo(minutes === 1 ? '1 minute' : `${minutes} minutes`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  
  return <>{timeAgo}</>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/10">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.ico"
              alt="AIDE Logo"
              width={44}
              height={44}
              className='rounded-lg'
            />
            <span className="text-xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              AIDE
            </span>
          </div>
          <Link 
            href="/user" 
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 px-6 overflow-hidden bg-linear-to-br from-primary/5 via-background to-primary/5">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-center"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-6">
            Emergency Help <span className="text-primary">When Every Second Counts</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AIDE connects people with verified emergency resources including shelters, medical aid, food, and water during disasters and crises.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/map" 
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              View Emergency Map
            </Link>
          </div>
        </div>
      </header>

      {/* Live Stats Bar */}
      <div className="relative -mt-12 mb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-2xl p-5 shadow-lg flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
            {[
              { value: '142', label: 'Active Shelters', icon: <MapPin className="text-green-500" size={16} />, color: 'green-500' },
              { value: '89', label: 'Water Points', icon: <Droplet className="text-blue-500" size={16} />, color: 'blue-500' },
              { value: '56', label: 'Medical Stations', icon: <Heart className="text-amber-500" size={16} />, color: 'amber-500' },
              { value: '24/7', label: 'Support', icon: <Users className="text-purple-500" size={16} />, color: 'purple-500' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className={`p-2 rounded-lg bg-${stat.color}/10 group-hover:bg-${stat.color}/20 transition-colors`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-green-500 font-medium bg-green-500/10 px-3 py-1.5 rounded-full">
              <ShieldCheck size={16} />
              <span>Updated <LiveTimer /> ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Get the help you need in three simple steps. Our platform is designed to be intuitive and effective when you need it most.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <MapPin className="text-primary" size={24} />, 
                title: "1. Open the Map", 
                desc: "Our intelligent map automatically detects your location to show the nearest emergency resources and aid stations." 
              },
              { 
                icon: <Filter className="text-primary" size={24} />, 
                title: "2. Filter Resources", 
                desc: "Quickly find exactly what you need—shelters, medical aid, food, water, or power sources—with our intuitive filters." 
              },
              { 
                icon: <ShieldCheck className="text-primary" size={24} />, 
                title: "3. Get Assistance", 
                desc: "Access verified, up-to-date information and get turn-by-turn directions to the nearest help center or resource." 
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="group bg-background border border-border/50 rounded-2xl p-8 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-6 bg-linear-to-br from-background to-muted/20">
        <div className="max-w-5xl mx-auto text-center">
          {/* <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
            <Globe className="h-4 w-4" />
            <span>Global Impact</span>
          </div> */}
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Making a Difference When It Matters Most
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            In times of crisis, reliable information saves lives. AIDE empowers communities with real-time data, reducing response times and connecting people to critical aid when it matters most.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {[
              { value: '50K+', label: 'People Helped' },
              { value: '2K+', label: 'Verified Resources' },
              { value: '24/7', label: 'Active Support' },
              { value: '50+', label: 'Communities Served' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center bg-linear-to-br from-background to-muted/30 border border-border/30 rounded-2xl p-12 shadow-sm">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of volunteers, submit resources, or get help when you need it most. Together, we can build a more resilient future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/map" 
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-primary/20"
            >
              Find Help Now
            </Link>
            <Link 
              href="/user" 
              className="px-8 py-3 bg-background text-foreground hover:bg-accent/50 rounded-lg font-bold text-lg transition-all border border-border hover:border-primary/50"
            >
              Contribute Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}