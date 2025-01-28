import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User2, MessageSquare, MessageCircle, ArrowUpRight, Check } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSuccess(true);
    setLoading(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const offices = [
    {
      city: 'Toronto',
      address: '15 Lower Jarvis Street',
      postal: 'M5E 0C4',
      phone: '+1 647 973 4113',
      email: 'info@nauticedge.io',
      hours: '9:00 AM - 6:00 PM EST'
    },
    {
      city: 'Rotterdam',
      address: 'Wilhelminakade 123',
      postal: '3072 AP',
      phone: '+31 10 123 4567',
      email: 'nl@nauticedge.io',
      hours: '9:00 AM - 6:00 PM CET'
    },
    {
      city: 'Miami',
      address: '800 Brickell Avenue, Suite 1200',
      postal: 'FL 33131',
      phone: '+1 305 123 4567',
      email: 'us@nauticedge.io',
      hours: '9:00 AM - 6:00 PM EST'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-colors">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative min-h-[500px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-32 pb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in-up">
              Have questions about NauticEdge? We're here to help. Reach out to our team
              and we'll respond as soon as possible.
            </p>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent animate-blob"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent animate-blob animation-delay-2000"></div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[800px] h-[800px] -top-96 -left-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute w-[800px] h-[800px] -bottom-96 -right-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mr-4">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Send us a Message</h2>
                  <p className="text-gray-600 dark:text-gray-400">We'll get back to you shortly</p>
                </div>
              </div>
              
              {success ? (
                <div className="bg-green-50/50 dark:bg-green-900/20 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 rounded-xl p-8 text-center animate-fade-in">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 dark:text-green-400 mb-2">Message Sent!</h3>
                  <p className="text-green-600 dark:text-green-400">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter subject"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={6}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                      placeholder="Enter your message"
                      required
                    ></textarea></div>
                  </div>
                  
                  <div className="relative group">
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full group"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600 rounded-lg"></span>
                      <div className="relative w-full px-7 py-4 rounded-lg leading-none flex items-center justify-center space-x-2">
                        {loading ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span className="text-white">Send Message</span>
                            <Send className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white mb-8">Our Offices</h2>
              <div className="space-y-8">
                {offices.map((office, index) => (
                  <div 
                    key={index} 
                    className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 mb-4">{office.city}</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">{office.address}</p>
                          <p className="text-gray-600 dark:text-gray-400">{office.postal}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Phone className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                        </div>
                        <a href={`tel:${office.phone}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {office.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                        </div>
                        <a href={`mailto:${office.email}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {office.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{office.hours}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;