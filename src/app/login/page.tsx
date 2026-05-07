"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        setLoading(false);
      } else {
        toast.success("Login berhasil! Mengalihkan...");
      }
    } catch (e) {
      toast.error("Terjadi kesalahan sistem");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Side — Visual */}
      <div className="hidden lg:flex relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Property"
          fill
          className="object-cover scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2.5 rounded-2xl shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-foreground">
              Agent<span className="text-primary">Pro</span>
            </span>
          </Link>
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest uppercase text-primary mb-8 animate-fade-up">
              Secure Access Panel
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-[1] tracking-tighter text-foreground animate-fade-up [animation-delay:200ms]">
              Kelola <br /> <span className="text-primary">Properti</span> Anda
            </h2>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed animate-fade-up [animation-delay:400ms]">
              Platform all-in-one untuk manajemen listing properti, komunikasi dengan calon pembeli, dan pertumbuhan bisnis Anda.
            </p>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground/40 text-xs font-black uppercase tracking-widest">
            <span>&copy; {new Date().getFullYear()} AgentPro</span>
            <span className="h-1 w-1 rounded-full bg-current" />
            <span>Premium Property Solution</span>
          </div>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Background Gradients for depth */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-md space-y-10 relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-2xl">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground">
                Agent<span className="text-primary">Pro</span>
              </span>
            </Link>
          </div>

          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="space-y-3 p-10 pb-2">
              <CardTitle className="text-4xl font-black tracking-tighter text-center lg:text-left">Login Admin</CardTitle>
              <CardDescription className="text-muted-foreground font-medium text-base text-center lg:text-left">
                Masukkan kredensial Anda untuk mengakses dashboard manajemen.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-8">
              {error && (
                <div className="mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm font-bold text-destructive animate-shake">
                  {error}
                </div>
              )}

              <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@agentpro.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                    className="h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 font-bold"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Secure Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      autoComplete="current-password"
                      className="h-14 rounded-2xl border-border/50 bg-background/50 pr-12 focus:ring-primary/20 font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground/50 hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Authorize Access"
                  )}
                </Button>
              </form>

              <div className="mt-10 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
                >
                  <Home className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Website
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
