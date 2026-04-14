import { Users, Trophy, Calendar, Phone, Zap, Target, Award, Heart } from 'lucide-react';

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
      {/* Call to Action */}
      <div className="relative mb-16">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-3xl opacity-10 blur-xl animate-pulse"></div>

        <div className="relative bg-black bg-opacity-50 backdrop-blur-sm p-12 rounded-3xl border border-gray-700">
          <h3
            className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500"
            style={{ fontFamily: 'Garamond, serif' }}
          >
            Begin Your Journey Today
          </h3>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join hundreds of students who have transformed their lives through the discipline and art of Taekwondo
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-10 rounded-xl transition-all duration-300 text-lg group overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105">
              <span className="relative z-10">Register Now</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Zap className="inline-block ml-2 w-5 h-5 group-hover:animate-bounce" />
            </button>
            <button className="relative border-2 border-white text-white hover:bg-white hover:text-black font-bold py-4 px-10 rounded-xl transition-all duration-300 text-lg group overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105">
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Target className="inline-block ml-2 w-5 h-5 group-hover:animate-spin" />
            </button>
          </div>
        </div>
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

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative bg-black bg-opacity-40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-yellow-400 transition-all duration-500 group hover:transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400 opacity-0 group-hover:opacity-20 animate-gradient-x"></div>
            <div className="absolute inset-0.5 bg-black bg-opacity-90 rounded-2xl"></div>

            <div className="relative flex flex-col items-center text-center">
              {feature.icon}
              <h3
                className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300"
                style={{ fontFamily: 'Garamond, serif' }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Decorative element */}
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Section */}
      <div className="mb-16 relative">
        {/* Floating decorative elements */}
        <div className="absolute -top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-10 animate-float"></div>
        <div className="absolute -top-5 right-20 w-12 h-12 bg-red-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>

        <h2
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-400 to-white animate-gradient-x"
          style={{ fontFamily: 'Garamond, serif' }}
        >
          Welcome to Excellence
        </h2>

        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-8 animate-pulse"></div>

        <p
          className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed opacity-90"
          style={{ fontFamily: 'Garamond, serif' }}
        >
          The N STARS TAEKWONDO Academy is committed to promoting the art of Taekwondo
          through traditional training methods, competitive excellence, and community development.
        </p>
      </div>
    </div>
  );
};

export default MainContent;