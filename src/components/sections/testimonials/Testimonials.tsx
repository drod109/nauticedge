import React from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'James Wilson',
    role: 'Senior Surveyor',
    company: 'Maritime Inspections Ltd',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
    quote: 'NauticEdge has revolutionized how we conduct surveys. The mobile app and real-time reporting features have saved us countless hours.',
    rating: 5
  },
  {
    name: 'Sarah Chen',
    role: 'Fleet Manager',
    company: 'Pacific Marine',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
    quote: 'The analytics and reporting capabilities have given us unprecedented insights into our fleet maintenance needs.',
    rating: 5
  },
  {
    name: 'Robert Martinez',
    role: 'Insurance Adjuster',
    company: 'Marine Underwriters',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
    quote: 'Having standardized, digital survey reports has streamlined our entire claims process. The level of detail and consistency in the reports has significantly reduced processing time.',
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] -top-96 -right-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-[800px] h-[800px] -bottom-96 -left-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center">
              <Quote className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Hear from the professionals who use our platform every day
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-bl-[100px] opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 dark:text-yellow-500 fill-current" />
                ))}
              </div>
              
              <blockquote className="relative mb-8">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-100 dark:text-blue-900/20 transform -scale-x-100" />
                <p className="text-gray-700 dark:text-gray-300 relative z-10">"{testimonial.quote}"</p>
              </blockquote>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900/20 mr-4 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-colors"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;