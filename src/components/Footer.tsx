import React from 'react';
import { Shield, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
  ];

  const contactInfo = [
    { icon: <Mail size={18} />, text: 'info@taekwondopalghar.org', href: 'mailto:info@taekwondopalghar.org' },
    { icon: <Phone size={18} />, text: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: <MapPin size={18} />, text: 'Palghar District, Maharashtra', href: '#' },
  ];

  return (
    <footer className="relative bg-black bg-opacity-90 backdrop-blur-lg border-t border-gray-700">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-10 h-10 text-yellow-400" />
                <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h3 
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'Garamond, serif' }}
                >
                  N STARS TAEKWONDO ACADEMY
                </h3>
                <p className="text-sm text-gray-400">Excellence in Martial Arts</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Dedicated to promoting traditional Taekwondo values, discipline, and excellence 
              throughout the Palghar District community.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-20 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h4 
              className="text-xl font-bold text-white mb-4"
              style={{ fontFamily: 'Garamond, serif' }}
            >
              Get in Touch
            </h4>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center space-x-3 text-gray-300 hover:text-yellow-400 transition-colors duration-300 group"
                >
                  <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-yellow-400 group-hover:bg-opacity-20 transition-all duration-300">
                    {contact.icon}
                  </span>
                  <span>{contact.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 
              className="text-xl font-bold text-white mb-4"
              style={{ fontFamily: 'Garamond, serif' }}
            >
              Training Programs
            </h4>
            <div className="space-y-3">
              {[
                'Beginner Classes',
                'Advanced Training',
                'Competition Prep',
                'Youth Programs',
                'Adult Classes',
                'Private Lessons'
              ].map((program, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300 cursor-pointer group"
                >
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <span>{program}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              © 2024 N Stars Taekwondo Academy. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-yellow-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-yellow-400 transition-colors duration-300">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;