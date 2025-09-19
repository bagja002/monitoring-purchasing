"use client"

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from 'axios';
import { setCookie } from "cookies-next";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    // Basic validation
    if (!email || !password) {
      toast.error("Error", {
        description: "Email dan password harus diisi",
      });
      return;
    }

    setIsLoading(true);

    const baseUrl = "http://103.177.176.202:6402";
    
    try {
      const response = await axios.post(`${baseUrl}/operator/login`, {
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });

      // Success response
      if (response.data && response.data.t) {
        // Save token to cookie with name XSX01 using cookies-next
        setCookie('XSX01', response.data.t, { 
          maxAge: 1 * 24 * 60 * 60, // 7 days in seconds
          //secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          httpOnly: false // Set to true if you want it to be httpOnly
        });

        toast.success("Login berhasil!", {
          description: "Selamat datang kembali",
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        throw new Error('Token tidak ditemukan dalam response');
      }

    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = "Terjadi kesalahan saat login";
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 401:
              errorMessage = "Email atau password salah";
              break;
            case 400:
              errorMessage = "Data yang dikirim tidak valid";
              break;
            case 500:
              errorMessage = "Server error. Coba lagi nanti";
              break;
            default:
              errorMessage = error.response.data?.message || `Error ${status}`;
          }
        } else if (error.request) {
          errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda";
        } else {
          errorMessage = error.message || "Terjadi kesalahan tidak terduga";
        }
      }

      toast.error("Login gagal", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Login EProc
          </CardTitle>
          <CardDescription className="text-lg font-semibold text-gray-700 mt-1">
            Operator Satdik Login
          </CardDescription>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mt-2">
            Sistem Monitoring Pengadaan Moderenisasi Sapras Pendidikan
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@mail.com"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="masukan password"
                  disabled={isLoading}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;