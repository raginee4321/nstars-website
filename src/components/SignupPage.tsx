import React, { useState } from "react";
import { authApi } from "../lib/api";
import { ViewType } from "../types";
import { Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface SignupPageProps {
    onNavigate: (view: ViewType) => void;
    onSignupSuccess: (email: string) => void;
}

export default function SignupPage({ onNavigate, onSignupSuccess }: SignupPageProps) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const update = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = "Name is required.";
        if (!form.email.trim()) errs.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
        if (!form.phone.trim()) errs.phone = "Phone number is required.";
        if (!form.password) errs.password = "Password is required.";
        else if (form.password.length < 6) errs.password = "At least 6 characters.";
        return errs;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            return;
        }

        setLoading(true);
        const { data, error: apiError } = await authApi.signup(form);
        setLoading(false);

        if (apiError) {
            setError(apiError);
            return;
        }

        onSignupSuccess(form.email);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center relative overflow-hidden">
            {/* Animated background */}
            <div 
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url("https://images.pexels.com/photos/7045558/pexels-photo-7045558.jpeg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-85"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full opacity-5 animate-float"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-red-500 rounded-full opacity-5 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-10 w-16 h-16 bg-blue-400 rounded-full opacity-5 animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-lg px-6 py-12">
                {/* Back button */}
                <button
                    onClick={() => onNavigate('home')}
                    className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Back to Home</span>
                </button>

                {/* Signup Card */}
                <div className="relative bg-black bg-opacity-60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-gray-700 shadow-2xl">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-3xl opacity-20 animate-gradient-x"></div>
                    <div className="absolute inset-0.5 bg-black bg-opacity-90 rounded-3xl"></div>
                    
                    <div className="relative">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                    <img 
                                        src="/logo_new.jpg" 
                                        alt="N Stars Logo" 
                                        className="relative w-28 h-28 object-cover rounded-full shadow-2xl border-2 border-yellow-400/50 transform group-hover:scale-110 transition-transform duration-500 bg-black/40"
                                    />
                                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full opacity-20 group-hover:opacity-40 blur animate-pulse"></div>
                                </div>
                            </div>
                            <h2 
                                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 mb-2"
                                style={{ fontFamily: 'Garamond, serif' }}
                            >
                                Start Your Journey
                            </h2>
                            <p className="text-gray-400">Create your account to join the academy</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-xl text-red-500 text-sm animate-shake">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSignup} className="space-y-6">
                            {/* Full Name */}
                            <div className="relative group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-300" />
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => update("name", e.target.value)}
                                        className={`w-full pl-12 pr-4 py-3 bg-gray-800 bg-opacity-50 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300`}
                                        placeholder="Riya Sharma"
                                        required
                                    />
                                    {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="relative group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-300" />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update("email", e.target.value)}
                                        className={`w-full pl-12 pr-4 py-3 bg-gray-800 bg-opacity-50 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300`}
                                        placeholder="you@example.com"
                                        required
                                    />
                                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="relative group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-300" />
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => update("phone", e.target.value)}
                                        className={`w-full pl-12 pr-4 py-3 bg-gray-800 bg-opacity-50 border ${fieldErrors.phone ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300`}
                                        placeholder="+91 99999 00000"
                                        required
                                    />
                                    {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="relative group">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-300" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={(e) => update("password", e.target.value)}
                                        className={`w-full pl-12 pr-12 py-3 bg-gray-800 bg-opacity-50 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300`}
                                        placeholder="At least 6 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-400 hover:to-red-400 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group overflow-hidden shadow-lg hover:shadow-2xl"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-400">
                                Already have an account?{' '}
                                <button 
                                    onClick={() => onNavigate('login')}
                                    className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-300"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
