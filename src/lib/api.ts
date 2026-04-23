const API_BASE_URL = import.meta.env.PROD 
  ? 'https://nstars-website.vercel.app/api' 
  : 'http://localhost:5000/api';

export const authApi = {
  login: async (credentials: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) return { error: data.message || 'Login failed' };
      return { data };
    } catch (error) {
      return { error: 'Network error' };
    }
  },
  signup: async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) return { error: data.message || 'Signup failed', rawError: data.error };
      return { data };
    } catch (error) {
      return { error: 'Network error' };
    }
  },
  verifyOtp: async (otpData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpData),
      });
      const data = await response.json();
      if (!response.ok) return { error: data.message || 'Verification failed' };
      return { data };
    } catch (error) {
      return { error: 'Network error' };
    }
  },
  resendOtp: async (emailData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });
      const data = await response.json();
      if (!response.ok) return { error: data.message || 'Resend failed' };
      return { data };
    } catch (error) {
      return { error: 'Network error' };
    }
  }
};
