import React from 'react';
import { Users, MessageSquare, Rocket, Award, ArrowUpRight, Globe, Calendar, User2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Community = () => {
  const discussions = [
    {
      title: 'Best practices for underwater hull inspections',
      author: 'James Wilson',
      replies: 24,
      views: '2.1k',
      category: 'Best Practices',
      time: '2 hours ago'
    },
    {
      title: 'Using drones for vessel surveys: Tips and tricks',
      author: 'Sarah Chen',
      replies: 18,
      views: '1.8k',
      category: 'Technology',
      time: '4 hours ago'
    },
    {
      title: 'New IMO regulations impact on surveys',
      author: 'Robert Martinez',
      replies: 32,
      views: '2.5k',
      category: 'Regulations',
      time: '6 hours ago'
    }
  ];

  const events = [
    {
      title: 'Virtual Surveyor Meetup',
      date: 'February 1, 2024',
      time: '2:00 PM EST',
      type: 'Online',
      attendees: 156
    },
    {
      title: 'Maritime Tech Conference',
      date: 'February 15, 2024',
      time: '9:00 AM EST',
      type: 'In-person',
      location: 'Toronto, Canada',
      attendees: 250
    }
  ];

  const members = [
    {
      name: 'James Wilson',
      role: 'Senior Surveyor',
      contributions: 234,
      joined: 'Jan 2023',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80'
    },
    {
      name: 'Sarah Chen',
      role: 'Marine Engineer',
      contributions: 189,
      joined: 'Mar 2023',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80'
    },
    {
      name: 'Robert Martinez',
      role: 'Technical Director',
      contributions: 156,
      joined: 'Apr 2023',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Join the NauticEdge Community
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Connect with marine professionals, share knowledge, and stay updated with the latest in maritime surveying.
            </p>
          </div>
        </div>
      </div>

      {/* Latest Discussions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Discussions</h2>
          <a
            href="#"
            className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 flex items-center group"
          >
            View All
            <ArrowUpRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
        <div className="space-y-6">
          {discussions.map((discussion, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 mb-2">
                    {discussion.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {discussion.title}
                  </h3>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <User2 className="h-4 w-4 mr-1" />
                      {discussion.author}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {discussion.replies} replies
                    </span>
                    <span className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {discussion.views} views
                    </span>
                    <span>{discussion.time}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {event.type}
                      {event.location && ` • ${event.location}`}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {event.attendees} attendees
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 border border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Top Contributors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {member.contributions} contributions
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  Joined {member.joined}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Join Our Community</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect with marine professionals, share knowledge, and stay updated with the latest in maritime surveying.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors group"
          >
            Get Started
            <Rocket className="ml-2 h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Community;