import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Features', href: '#features' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact Us', href: '#contact' },
  ];

  return (
    <footer id="contact" className="relative bg-[#0a0f1a] border-t border-gray-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          
          {/* Column 1: Branding */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <img
                src="/logo1.png"
                alt="N Stars Logo"
                className="w-16 h-16 object-cover rounded-full shadow-2xl"
              />
              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                N STARS<br />
                TAEKWONDO ACADEMY
              </h3>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm font-light">
              Empowering your future, one kick at a time. Join N Stars Academy today and ignite your potential in the art of Taekwondo.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-5 pt-4">
              {[
                { icon: <Facebook />, href: '#', label: 'Facebook' },
                { icon: <Instagram />, href: '#', label: 'Instagram' },
                { icon: <Twitter />, href: '#', label: 'Twitter' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="p-3 bg-gray-900 rounded-full text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="md:pl-16">
            <h4 className="text-xl font-bold text-white mb-8">Links</h4>
            <ul className="space-y-6">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 font-medium transition-colors duration-300 block text-lg"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-8">
            <h4 className="text-xl font-bold text-white mb-8">Contact Us</h4>
            
            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start space-x-5 group">
                <div className="p-4 bg-white rounded-full text-[#0a0f1a] group-hover:bg-yellow-400 transition-colors duration-300 shadow-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-1">Give us a call</p>
                  <a href="tel:+919967379277" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                    +91 99673 79277
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-5 group">
                <div className="p-4 bg-white rounded-full text-[#0a0f1a] group-hover:bg-yellow-400 transition-colors duration-300 shadow-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-1">Send us an email</p>
                  <a href="mailto:nsawant2147@gmail.com" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                    nsawant2147@gmail.com
                  </a>
                </div>
              </div>

              {/* Visit Us */}
              <div className="flex items-start space-x-5 group">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=A/34+Rashmi+Residency,+Near+Balaji+Banquet+Hall+%26+Behind+Fire+Brigade,+Vasai+Nalasopara+Link+Road,+Vasai+East,+Palghar+-+401208"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white rounded-full text-[#0a0f1a] hover:bg-yellow-400 transition-colors duration-300 shadow-xl font-bold"
                  title="View on Google Maps"
                >
                  <MapPin className="w-6 h-6" />
                </a>
                <div>
                  <p className="text-white font-bold text-lg mb-1">Visit us</p>
                  <p className="text-gray-400 leading-relaxed">
                    A/34 Rashmi Residency, Near Balaji Banquet Hall & Behind Fire Brigade,<br />
                    Vasai Nalasopara Link Road, Vasai East,<br />
                    Palghar - 401208
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-gray-800/50 flex flex-col items-center space-y-8 pb-10">
          <p className="text-gray-500 font-medium text-center text-sm md:text-base">
            © {new Date().getFullYear()} N Stars Academy. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-gray-400 font-medium bg-gray-900/50 px-6 py-3 rounded-full border border-gray-800 shadow-inner">
            <span>Made by</span>
            <a
              href="https://www.linkedin.com/in/raginee-sharma-08a256282"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 font-bold transition-all duration-300 hover:scale-105"
            >
              Raginee Sharma
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;