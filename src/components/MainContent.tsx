import React from 'react';
import { Users, Trophy, Calendar, Award, Heart, Target, Zap, LogIn } from 'lucide-react';

const MainContent: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-12 h-12 mb-4 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "Expert Training",
      description: "Learn from certified masters with years of experience in traditional Taekwondo.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Trophy className="w-12 h-12 mb-4 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "Championships",
      description: "Compete in district, state and national level competitions to showcase your skills.",
      gradient: "from-red-400 to-pink-500"
    },
    {
      icon: <Calendar className="w-12 h-12 mb-4 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "Regular Events",
      description: "Participate in workshops, seminars, and training camps throughout the year.",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Heart className="w-12 h-12 mb-4 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />,
      title: "Community",
      description: "Join a supportive community of martial artists dedicated to growth and excellence.",
      gradient: "from-green-400 to-emerald-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Members", icon: <Users className="w-6 h-6" /> },
    { number: "15+", label: "Years Experience", icon: <Award className="w-6 h-6" /> },
    { number: "50+", label: "Competitions Won", icon: <Trophy className="w-6 h-6" /> },
    { number: "100%", label: "Dedication", icon: <Target className="w-6 h-6" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto text-center">

      {/* Unified Hero Section */}
      <div className="mb-12 relative py-12 px-6 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-10 animate-float"></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-red-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Academy Name */}
          <h1
            className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 leading-tight"
          >
            <span style={{ color: '#111111', WebkitTextStroke: '1px rgba(255,255,255,0.9)' }}>N</span>
            {' '}
            <span style={{ color: '#ef4444' }}>S</span>
            <span style={{ color: '#3b82f6' }}>T</span>
            <span style={{ color: '#22c55e' }}>A</span>
            <span style={{ color: '#facc15' }}>R</span>
            <span style={{ color: '#ffffff' }}>S</span>
          </h1>
          <h1
            className="text-3xl md:text-5xl lg:text-7xl font-bold mb-10 leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-gradient-x">
              Taekwondo Academy
            </span>
          </h1>

          {/* Tagline */}
          <p
            className="text-base md:text-xl text-yellow-400 max-w-3xl mx-auto leading-relaxed tracking-[0.3em] font-medium mb-12 uppercase"
          >
            SPORTS • FITNESS • SELF DEFENCE • DISCIPLINE
          </p>

          {/* Benefits Paragraph */}
          <p className="text-xl md:text-3xl text-gray-200 font-light max-w-4xl mx-auto leading-relaxed mb-16">
            Join hundreds of students mastering the art of Taekwondo. Under the guidance of expert masters, build unshakeable confidence, master world-class skills, and become part of a 15+ year legacy of excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button className="group relative px-12 py-5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:shadow-[0_0_50px_rgba(250,204,21,0.6)] overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center">
                Register Now
              </span>
            </button>
            <button className="group px-12 py-5 rounded-xl border-2 border-yellow-400 text-yellow-400 font-bold text-xl transition-all duration-300 hover:bg-yellow-400 hover:text-black flex items-center space-x-3">
              <LogIn className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mx-auto mt-8 animate-pulse"></div>
      </div>

      {/* Feature Cards */}
      <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative bg-black bg-opacity-40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-yellow-400 transition-all duration-500 group hover:transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400 opacity-0 group-hover:opacity-20 animate-gradient-x"></div>
            <div className="absolute inset-0.5 bg-black bg-opacity-90 rounded-2xl"></div>

            <div className="relative flex flex-col items-center text-center">
              {feature.icon}
              <h3
                className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300"
              >
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {feature.description}
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-black bg-opacity-40 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-500 group hover:transform hover:scale-105"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center justify-center mb-3 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-gray-300 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="mb-12">
        <h2
          className="text-3xl md:text-5xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400"
        >
          About Us
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-12 animate-pulse"></div>
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-black bg-opacity-40 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-gray-800 hover:border-yellow-400 transition-all duration-700 text-left relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10 space-y-12">
              <div>
                <h3
                  className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6 flex items-center"
                >
                  <div className="w-12 h-0.5 bg-yellow-400 mr-4 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                  Our Story
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg md:text-xl italic font-light">
                  N Stars Taekwondo Academy was founded with a singular vision — to bring world-class martial arts training to the community. Over 15+ years, we have nurtured hundreds of students, instilling not just athletic skill, but discipline, confidence, and a warrior spirit that guides them through every walk of life.
                </p>
              </div>

              <div>
                <h3
                  className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6 flex items-center"
                >
                  <div className="w-12 h-0.5 bg-yellow-400 mr-4 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                  Our Mission
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg md:text-xl italic font-light">
                  We are committed to providing a safe, inclusive, and empowering training environment for students of all ages and skill levels. From beginners taking their first steps to seasoned competitors aiming for national glory, N Stars is where champions are made — one kick at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MainContent;