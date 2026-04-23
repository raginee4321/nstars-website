import React, { useState } from 'react';
import Layout from './components/layout';
import MainContent from './components/MainContent';
import Gallery from './components/Gallery';
import AdminDashboard from './components/AdminDashboard';
import QRScanner from './components/QRScanner';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import VerifyOtpPage from './components/VerifyOtpPage';
import './index.css';
import { ViewType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [pendingEmail, setPendingEmail] = useState('');

  const handleNavigate = (view: ViewType) => setCurrentView(view);

  const handleLoginSuccess = (data: any) => {
    setIsLoggedIn(true);
    setUser(data.user);
    if (data.user.isAdmin) {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
    sessionStorage.setItem('authToken', data.token);
  };

  const handleSignupSuccess = (email: string) => {
    setPendingEmail(email);
    setCurrentView('verify-otp');
  };

  const handleVerifySuccess = () => {
    alert('Account verified successfully! You can now log in.');
    setCurrentView('login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    sessionStorage.removeItem('authToken');
    setCurrentView('home');
  };

  if (currentView === 'admin' && isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (currentView === 'login') {
    return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'signup') {
    return <SignupPage onNavigate={handleNavigate} onSignupSuccess={handleSignupSuccess} />;
  }

  if (currentView === 'verify-otp') {
    return <VerifyOtpPage email={pendingEmail} onNavigate={handleNavigate} onVerifySuccess={handleVerifySuccess} />;
  }

  if (currentView === 'gallery') {
    return <Gallery onBack={() => setCurrentView('home')} />;
  }
  if (currentView === 'qrscanner') {
  return <QRScanner onBack={() => setCurrentView('home')} />;
}
  

  return (
    <Layout onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={handleLogout}>
      <MainContent onNavigate={handleNavigate} />
    </Layout>
  );
}

export default App;
