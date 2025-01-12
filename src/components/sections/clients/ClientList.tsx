import React from 'react';

const clients = [
  { name: 'Royal Caribbean', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80' },
  { name: 'Princess Cruises', logo: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=200&h=100&fit=crop&q=80' },
  { name: 'Marina Bay', logo: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?w=200&h=100&fit=crop&q=80' },
  { name: 'Port Authority', logo: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=200&h=100&fit=crop&q=80' },
  { name: 'Maritime Insurance Co', logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=100&fit=crop&q=80' },
  { name: 'Global Shipping', logo: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?w=200&h=100&fit=crop&q=80' }
];

// Duplicate the array to create a seamless loop
const scrollingClients = [...clients, ...clients];

const ClientList = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex animate-scroll">
        {scrollingClients.map((client, index) => (
          <div
            key={`${client.name}-${index}`}
            className="flex-shrink-0 mx-12"
          >
            <img
              src={client.logo}
              alt={client.name}
              className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;