import React from 'react';
import { Ship, Briefcase, MapPin, Clock, ArrowUpRight, GraduationCap, Users, Wrench } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Careers = () => {
  const jobs = [
    {
      title: 'Sr. Development Engineer',
      location: 'Toronto, Canada',
      type: 'Full-time',
      department: 'Engineering',
      icon: Wrench,
      description: 'Lead the development of our marine survey platform and implement new features.',
      requirements: [
        '8+ years of software development experience',
        'Strong expertise in React, TypeScript, and Node.js',
        'Experience with real-time applications and WebSocket',
        'Background in maritime technology is a plus',
        'Strong system design and architecture skills'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Comprehensive health and dental coverage',
        'Flexible work arrangements',
        'Professional development budget',
        'Regular team events and activities'
      ]
    },
    {
      title: 'Chief Operating Officer',
      location: 'Toronto, Canada',
      type: 'Full-time',
      department: 'Executive',
      icon: Users,
      description: 'Drive operational excellence and scale our growing maritime technology company.',
      requirements: [
        '15+ years of operational leadership experience',
        'Track record of scaling technology companies',
        'Strong understanding of maritime industry',
        'Experience with international operations',
        'MBA or equivalent experience'
      ],
      benefits: [
        'Executive compensation package',
        'Performance-based bonuses',
        'Executive health benefits',
        'Travel opportunities',
        'Strategic decision-making role'
      ]
    },
    {
      title: 'Head Product Designer',
      location: 'Toronto, Canada',
      type: 'Full-time',
      department: 'Design',
      icon: GraduationCap,
      description: 'Shape the future of marine survey software through innovative design solutions.',
      requirements: [
        '10+ years of product design experience',
        'Strong portfolio of B2B SaaS products',
        'Experience leading design teams',
        'Expertise in design systems',
        'Understanding of maritime workflows'
      ],
      benefits: [
        'Competitive salary',
        'Health and wellness benefits',
        'Remote work options',
        'Design conference budget',
        'Latest design tools and equipment'
      ]
    }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We push boundaries and embrace new technologies to transform the maritime industry.'
    },
    {
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from code to customer service.'
    },
    {
      title: 'Collaboration',
      description: 'We work together across teams and with our customers to create the best solutions.'
    },
    {
      title: 'Impact',
      description: 'We measure our success by the positive impact we have on the maritime industry.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[500px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Help us transform the maritime industry with innovative technology solutions.
              We're looking for passionate individuals to join our growing team.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Open Positions</h2>
        <div className="space-y-8">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-700/50 overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center">
                      <job.icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.department}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 group/button">
                    View Position
                    <ArrowUpRight className="ml-1 h-4 w-4 transform group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform" />
                  </button>
                </div>
                
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {job.description}
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Requirements</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                          <span className="h-1.5 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Benefits</h4>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                          <span className="h-1.5 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Don't See Your Role?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors group"
          >
            Contact Us
            <ArrowUpRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;