import React from 'react';
import { Anchor, Shield, Users, BarChart3, Globe, Award } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const About = () => {
  const stats = [
    { label: 'Active Users', value: '2,000+' },
    { label: 'Surveys Completed', value: '15,000+' },
    { label: 'Countries', value: '25+' },
    { label: 'Client Satisfaction', value: '98%' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'We maintain the highest standards of security and data protection in the maritime industry.'
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Our solutions are built around the needs of marine surveyors, boat owners, and insurers.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Supporting maritime professionals across the globe with localized solutions.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering exceptional quality in every aspect of our service.'
    }
  ];

  const team = [
    {
      name: 'Dwayne N. Rodrigues',
      role: 'Chief Executive Officer & Chief Technology Officer',
      image: 'https://1drv.ms/i/c/a66e4d4b5eaf9ea2/IQSinq9eS01uIICm0w8AAAAAAewk-t-tWUaIusBRM2u6LX0?width=256&height=256',
      bio: '15+ years of IT industry experience'
    },
    {
      name: 'James Wilson',
      role: 'Chief Operating Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
      bio: 'Former marine surveyor, tech innovator'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80',
      bio: 'Product development expert'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors">
      <Navigation />

      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-white dark:from-dark-900 dark:to-dark-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Revolutionizing Marine Surveys
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              NauticEdge is transforming the maritime industry with innovative digital solutions
              for marine surveyors, boat owners, and insurers worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-500">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              To empower maritime professionals with cutting-edge digital tools that enhance
              efficiency, accuracy, and collaboration in marine surveys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-dark-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700">
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Meet the experienced professionals leading NauticEdge's innovation in maritime technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-48 h-48 mx-auto">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-500 mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Want to learn more about how NauticEdge can transform your marine survey operations?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 md:text-lg"
          >
            Contact Us
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;