import React, { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ArrowLeft } from 'lucide-react';

interface QRScannerProps {
  onBack?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onBack }) => {
  const [scannedUrl, setScannedUrl] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [scannerStarted, setScannerStarted] = useState(false);

  const startScanner = () => {
    setScannerStarted(true);
    const html5QrCode = new Html5Qrcode('reader');

    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 20, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        setScannedUrl(decodedText);
        setShowLogin(true);
        html5QrCode.stop().catch((err) => console.error(err));
      },
      (errorMessage) => console.error(errorMessage)
    ).catch(err => console.error(err));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      window.location.href = scannedUrl;
    } else {
      setLoginMessage('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm font-serif p-6">
      
      {/* Back to Home Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
      )}

      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-4 text-yellow-400">
        <img src="/logo_new.jpg" alt="Logo" className="w-16 h-16 rounded-full border-2 border-yellow-400/50 object-cover shadow-lg bg-black/40" />
        Scan Your Certificate here
      </h1>

      {/* Start Scan Button */}
      {!scannerStarted && (
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 mb-6"
          onClick={startScanner}
        >
          Start Scan
        </button>
      )}

      {/* QR Reader */}
      <div
        id="reader"
        className={`border-2 border-gray-700 rounded-2xl w-72 md:w-96 mb-6 ${scannerStarted ? 'block' : 'hidden'}`}
      ></div>

      {/* Scanned URL */}
      {scannedUrl && (
        <div className="text-center mb-4 p-4 bg-black bg-opacity-50 border border-gray-700 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2 text-yellow-400">QR Code Scanned!</h2>
          <p className="text-blue-400 break-words">
            URL: <a href={scannedUrl} target="_blank" rel="noopener noreferrer" className="underline">{scannedUrl}</a>
          </p>
        </div>
      )}

      {/* Login Form */}
      {showLogin && (
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-3 border p-6 rounded-2xl shadow-2xl w-full max-w-sm bg-black bg-opacity-50 backdrop-blur-sm border-gray-700"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded focus:outline-none focus:border-yellow-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded focus:outline-none focus:border-yellow-400"
            required
          />
          <button className="w-full py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black rounded-xl font-bold transition-all duration-300">
            Login
          </button>
          {loginMessage && <p className="text-red-500 mt-2">{loginMessage}</p>}
        </form>
      )}
    </div>
  );
};

export default QRScanner;
