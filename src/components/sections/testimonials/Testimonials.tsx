import React from 'react';
import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    name: 'James Wilson',
    role: 'Senior Surveyor',
    company: 'Maritime Inspections Ltd',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
    quote: 'This platform has revolutionized how we conduct surveys. The mobile app and real-time reporting features save us countless hours.',
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
    quote: 'Having standardized, digital survey reports has streamlined our entire claims process. Highly recommended.',
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from the professionals who use our platform every day
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;