"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side — Visual */}
      <div className="hidden lg:flex relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Property"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/10">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Agent<span className="text-blue-400">Pro</span>
            </span>
          </Link>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Kelola Properti Anda Dengan Mudah
            </h2>
            <p className="text-white/70 text-lg">
              Platform all-in-one untuk manajemen listing properti, komunikasi dengan calon pembeli, dan pertumbuhan bisnis Anda.
            </p>
          </div>
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} AgentPro. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Agent<span className="text-primary">Pro</span>
              </span>
            </Link>
          </div>

          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader className="space-y-1 text-center lg:text-left">
              <CardTitle className="text-2xl font-bold">Login Admin</CardTitle>
              <CardDescription>
                Masukkan email dan password untuk mengakses panel admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <form action={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Kembali ke halaman utama
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
