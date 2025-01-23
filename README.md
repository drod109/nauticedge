# NauticEdge - Modern Marine Survey Platform

![NauticEdge](https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200&h=400)

NauticEdge is a comprehensive digital platform designed for marine surveyors, boat owners, and insurers. It streamlines the marine survey process with powerful digital tools and real-time collaboration features.

## 🚀 Features

### Core Features
- **Digital Survey Tools**
  - Mobile-first survey capabilities
  - Offline data capture
  - Photo and video documentation
  - Real-time updates and sync
  
- **Client Management**
  - Comprehensive client profiles
  - Document storage
  - Communication tools
  - Automated notifications

- **Invoice Management**
  - Professional invoice builder
  - Customizable templates
  - PDF generation
  - Payment tracking
  - Tax calculation
  - Email notifications

- **Appointment Scheduling**
  - Interactive calendar interface
  - Real-time availability
  - Location tracking
  - Email notifications
  - Upcoming appointments overview

### Security Features
- **Enhanced Authentication**
  - Email/password authentication
  - Two-factor authentication (2FA)
    - TOTP-based authentication
    - QR code setup
    - Recovery codes
  - Session management
    - Device recognition
    - Location tracking
    - Concurrent session control

- **Profile Management**
  - Profile photo upload
  - Company information
  - Personal details
  - Location detection

### Subscription Plans
- **Basic Plan ($49/month)**
  - Core survey features
  - Basic reporting
  - Standard support
  - 5GB storage

- **Professional Plan ($99/month)**
  - Everything in Basic
  - Advanced analytics
  - Priority support
  - 50GB storage
  - API access
  - Team collaboration

- **Enterprise Plan ($249/month)**
  - Everything in Professional
  - Custom integrations
  - 24/7 support
  - Unlimited storage
  - White-label reports
  - Advanced team management

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
  - Responsive design
  - Dark mode support
- Lucide Icons
- Vite for build tooling

### Backend & Infrastructure
- Supabase
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage for profile photos
  - Authentication & authorization

## 📋 Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Supabase account
- OpenCage API key (for location services)

## 🔧 Environment Setup

1. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENCAGE_API_KEY=your_opencage_api_key
```

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/nauticedge.git
cd nauticedge
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🗄️ Project Structure

```plaintext
nauticedge/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── invoice/       # Invoice components
│   │   ├── profile/       # Profile components
│   │   ├── schedule/      # Scheduling components
│   │   └── sections/      # Landing page sections
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library configurations
│   ├── pages/            # Page components
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utility functions
├── supabase/
│   └── migrations/       # Database migrations
└── public/              # Static assets
```

## 🔒 Security Features

- Two-factor authentication (TOTP)
- Session management and tracking
- Device fingerprinting
- Location-based security
- Rate limiting
- Input validation
- Data encryption

## 🌐 API Access (Professional & Enterprise)

- RESTful endpoints
- Rate limiting
- Authentication & authorization
- OpenAPI documentation
- Webhook support

## 🎨 Accessibility

- WCAG 2.1 compliant
- High contrast in light/dark themes
- Keyboard navigation support
- Screen reader friendly
- Responsive design

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for backend infrastructure
- [React](https://reactjs.org/) for frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons