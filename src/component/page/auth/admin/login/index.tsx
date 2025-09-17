"use client"

import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const route = useRouter()

  const handleSubmit = () => {
    route.push("dashboard")
  };


  
 

  return (
    <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto relative">

        {/* Modal Content */}
        <div className="p-8 pt-12">
           {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                Login E-Purchasing
              </h1>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mt-1">
                Admin Pusat Login
              </h2>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
              Sistem Monitoring Pengadaan Moderenisasi Sapras Pendidikan
            </p>
          </div>
          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email 
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@mail.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="masukan password"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
            >
              Login
            </button>
          </div>

          {/* Additional Options */}
         
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;