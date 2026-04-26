import React, { useState, useEffect } from "react";
import { authApi } from "../lib/api";
import { ViewType } from "../types";
import { ArrowRight } from 'lucide-react';

interface VerifyOtpPageProps {
    email: string;
    onNavigate: (view: ViewType) => void;
    onVerifySuccess: () => void;
}

export default function VerifyOtpPage({ email, onNavigate, onVerifySuccess }: VerifyOtpPageProps) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendDisabled, setResendDisabled] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        let interval: any;
        if (resendDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setResendDisabled(false);
            setTimer(30);
        }
        return () => clearInterval(interval);
    }, [resendDisabled, timer]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const otpString = otp.join("");
        if (otpString.length < 6) {
            setError("Please enter the 6-digit code.");
            return;
        }

        setLoading(true);
        const { error: apiError } = await authApi.verifyOtp({ email, otp: otpString });
        setLoading(false);

        if (apiError) {
            setError(apiError);
            return;
        }

        onVerifySuccess();
    };

    const handleResend = async () => {
        setResendDisabled(true);
        setError("");
        const { error: apiError } = await authApi.resendOtp({ email });
        if (apiError) {
            setError(apiError);
            setResendDisabled(false);
            return;
        }
        alert("A new OTP has been sent to your email.");
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

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Back button */}
                <button
                    onClick={() => onNavigate('signup')}
                    className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Back to Signup</span>
                </button>

                {/* OTP Card */}
                <div className="relative bg-black bg-opacity-60 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-gray-700 shadow-2xl">
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
                                Verify Email
                            </h2>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Enter the code sent to <br className="sm:hidden" /> 
                                <span className="text-yellow-400 break-all">{email}</span>
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-xl text-red-500 text-sm animate-shake">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* OTP Inputs */}
                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="flex justify-between gap-1 sm:gap-2">
                                {otp.map((digit, idx) => (
                                    <div key={idx} className="relative group flex-1">
                                        <input
                                            id={`otp-${idx}`}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(idx, e)}
                                            className="w-full h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-gray-800 bg-opacity-50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                                            maxLength={1}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                ))}
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
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify Code
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center space-y-4">
                            <p className="text-sm text-gray-400">
                                Didn't receive the code?{' '}
                                <button 
                                    onClick={handleResend}
                                    disabled={resendDisabled}
                                    className={`font-semibold transition-colors duration-300 ${resendDisabled ? 'text-gray-600 cursor-not-allowed' : 'text-yellow-400 hover:text-yellow-300'}`}
                                >
                                    {resendDisabled ? `Resend in ${timer}s` : "Resend"}
                                </button>
                            </p>
                            <button 
                                onClick={() => onNavigate('signup')}
                                className="text-sm text-gray-500 hover:text-white transition-colors duration-300 underline"
                            >
                                Use a different email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
