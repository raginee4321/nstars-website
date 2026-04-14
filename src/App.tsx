import React, { useState } from 'react';
import Layout from './components/layout';
import MainContent from './components/MainContent';
import Gallery from './components/Gallery';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import QRScanner from './components/QRScanner';
import './index.css';
import { ViewType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigate = (view: ViewType) => setCurrentView(view);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin12345') {
      setIsLoggedIn(true);
      setCurrentView('admin');
    } else {
      alert('Invalid credentials. Use admin / admin12345 to login.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  if (currentView === 'admin' && isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (currentView === 'login') {
    return <LoginForm onLogin={handleLogin} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'gallery') {
    return <Gallery onBack={() => setCurrentView('home')} />;
  }
  if (currentView === 'qrscanner') {
  return <QRScanner onBack={() => setCurrentView('home')} />;
}


/*  if (currentView === 'qrscanner') {
    return <QRScanner />;
  }*/
  

  return (
    <Layout onNavigate={handleNavigate}>
      <MainContent />
    </Layout>
  );
}

export default App;
