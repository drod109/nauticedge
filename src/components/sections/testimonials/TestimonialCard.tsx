import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  image,
  quote,
  rating
}) => {
  return (
    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <blockquote className="text-gray-700 dark:text-gray-300 mb-6">"{quote}"</blockquote>
      <div className="flex items-center">
        <img
          src={image}
          alt={name}
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{role} at {company}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;