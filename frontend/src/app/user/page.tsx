"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  Activity,
  AlertCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://crisisaid-backend.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful login, set cookies instead of localStorage
        Cookies.set('authToken', data.session.access_token, { 
          expires: 7,
          secure: true,
          sameSite: 'lax',
        });

        Cookies.set('data', JSON.stringify(data.data.user), { 
          expires: 7,
          secure: true,
          sameSite: 'lax',
        });

        // console.log('data: ', data);
        toast.success(`Welcome back, ${data.data.user.name}!`);
        
        // Redirect based on role
        if (data.data.user.role === 'ADMIN') {
          router.push("/admin");
        } else if (data.data.user.role === 'VOLUNTEER') {
          router.push("/volunteer");
        } else if (data.data.user.role === 'USER') {
          router.push("/map");
        } else {
          router.push("/");
        }
      } else {
        // Handle specific error messages from backend
        setError(data.data.message || data.error || "Invalid email or password");
        toast.error(data.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server. Please try again later.");
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Name validation
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://crisisaid-backend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password,
          role: "USER" // Default role, can be changed by admin later
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Please sign in.");
        
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        
        // Switch to login tab
        const loginTab = document.querySelector('[value="login"]') as HTMLButtonElement;
        if (loginTab) loginTab.click();
        
      } else {
        // Handle specific error messages from backend
        if (data.message && data.message.includes("already exists")) {
          setError("An account with this email already exists");
        } else {
          setError(data.message || data.error || "Registration failed. Please try again.");
        }
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Unable to connect to the server. Please try again later.");
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center px-6">
      {/* Brand Identity */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-primary p-2 rounded-xl">
            <Activity size={32} className="text-white" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-light-bg">
            CrisisAid
          </span>
        </div>
        <p className="text-light-bg/70 font-medium">
          Internal Administration Portal
        </p>
      </div>

      {/* Login/Register Card */}
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="w-full h-12 mb-6 grid grid-cols-2 bg-card-dark border border-light-bg/10">
          <TabsTrigger 
            value="login"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="register"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Register
          </TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <div className="w-full bg-card-dark border border-light-bg/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-light-bg/10">
              <ShieldAlert className="text-primary" size={24} />
              <h2 className="text-xl font-bold text-light-bg">
                Login to Your Account
              </h2>
            </div>

            {error && (
              <div className="mb-6 bg-danger/10 border border-danger/20 rounded-xl p-4 flex gap-3 items-start">
                <AlertCircle
                  className="text-danger shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-sm text-light-bg/90">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="text-sm font-semibold text-light-bg/80 ml-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-light-bg/50"
                    size={20}
                  />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="admin@crisisaid.org"
                    className="w-full bg-card-light/5 border border-light-bg/10 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all text-light-bg placeholder-light-bg/40"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-light-bg/80 ml-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-light-bg/50"
                    size={20}
                  />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    className="w-full bg-card-light/5 border border-light-bg/10 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all text-light-bg placeholder-light-bg/40"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group ${
                  isLoading
                    ? "bg-primary/70 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-sm text-light-bg/60 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                ← Return to Public Home
              </Link>
            </div>
          </div>
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="register">
          <div className="w-full bg-card-dark border border-light-bg/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-light-bg/10">
              <ShieldAlert className="text-success" size={24} />
              <h2 className="text-xl font-bold text-light-bg">
                Create Your Account
              </h2>
            </div>

            {error && (
              <div className="mb-6 bg-danger/10 border border-danger/20 rounded-xl p-4 flex gap-3 items-start">
                <AlertCircle
                  className="text-danger shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-sm text-light-bg/90">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegisterAccount} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="register-name"
                  className="text-sm font-semibold text-light-bg/80 ml-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-light-bg/50"
                    size={20}
                  />
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    placeholder="John Doe"
                    className="w-full bg-card-light/5 border border-light-bg/10 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all text-light-bg placeholder-light-bg/40"
                    disabled={isLoading}
                    required
                    minLength={2}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="register-email"
                  className="text-sm font-semibold text-light-bg/80 ml-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-light-bg/50"
                    size={20}
                  />
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="admin@crisisaid.org"
                    className="w-full bg-card-light/5 border border-light-bg/10 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all text-light-bg placeholder-light-bg/40"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="register-password"
                  className="text-sm font-semibold text-light-bg/80 ml-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-light-bg/50"
                    size={20}
                  />
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    className="w-full bg-card-light/5 border border-light-bg/10 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all text-light-bg placeholder-light-bg/40"
                    disabled={isLoading}
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-light-bg/50 ml-1">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group ${
                  isLoading
                    ? "bg-success/70 cursor-not-allowed"
                    : "bg-success hover:bg-success/90 hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-sm text-light-bg/60 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                ← Return to Public Home
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Security Footer */}
      <p className="mt-12 text-xs text-light-bg/40 max-w-xs text-center leading-relaxed">
        Access to this system is logged. Unauthorized attempts will be reported.
        All data is encrypted with AES-256-GCM.
      </p>
    </div>
  );
}