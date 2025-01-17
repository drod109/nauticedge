# NauticEdge - Modern Marine Survey Platform

![NauticEdge](https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80)

NauticEdge is a comprehensive digital platform designed for marine surveyors, boat owners, and insurers. It streamlines the marine survey process with powerful digital tools and real-time collaboration features.

## 🌓 Theme Support

NauticEdge offers both light and dark themes to enhance user experience:

- **Automatic Detection**: Automatically detects system theme preference
- **Manual Toggle**: Easy theme switching with persistent preference
- **Optimized UI**: Carefully designed color schemes for both themes
- **Consistent Experience**: Maintains readability and aesthetics across themes

## Features

### Core Features
- **Digital Survey Tools**
  - Mobile-first survey capabilities
  - Offline data capture
  - Photo and video documentation
  - Real-time updates and sync
  - Premium features for Professional and Enterprise plans

- **Client Management**
  - Client profiles and history
  - Document storage
  - Communication tools
  - Automated notifications

- **Advanced Analytics**
  - Survey trend analysis
  - Custom reporting
  - Data visualization
  - Performance metrics
  - AI-powered analysis (Professional and Enterprise plans)

### Subscription Plans
- **Basic Plan ($49/month)**
  - Core survey features
  - Basic reporting
  - Standard support

- **Professional Plan ($99/month)**
  - Everything in Basic
  - Advanced analytics
  - AI-powered analysis
  - Priority support
  - API access

- **Enterprise Plan ($249/month)**
  - Everything in Professional
  - Custom integrations
  - Dedicated support
  - White-label reports
  - Advanced team management

### Security Features
- **Enhanced Authentication**
  - Email/password authentication
  - Two-factor authentication (2FA)
    - TOTP-based authentication
    - QR code setup
    - Recovery codes
    - Compatible with Google/Microsoft Authenticator
  - Session management
    - Device recognition
    - Location tracking
    - Concurrent session control
    - Session termination
  - Rate limiting for failed attempts

- **Profile Management**
  - Profile photo upload
  - Company information
  - Personal details
  - Location detection

- **Billing & Payments**
  - Multiple subscription tiers
  - Secure payment processing
  - Invoice management
  - Payment history
  - Card management

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
  - Dark mode support with custom color palette
  - Responsive design for all screen sizes
- Lucide Icons
- Vite for build tooling

### Backend & Infrastructure
- Supabase
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage for profile photos
  - Database functions and triggers
  - Subscription management
  - Session tracking

### API Features (Professional & Enterprise)
- RESTful endpoints
- Rate limiting
- Authentication & authorization
- Subscription validation
- OpenAPI documentation
- Webhook support
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage for profile photos
  - Database functions and triggers

### Authentication & Security
- Supabase Auth
- Multi-factor authentication (TOTP)
  - Dark theme support for all auth flows
  - Responsive design for mobile devices
- Session management
- Device tracking
- Location-based security

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Supabase account
- OpenCage API key (for location services)

## Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENCAGE_API_KEY=your_opencage_api_key
```

## Installation

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

## Database Setup

1. Create a new Supabase project
2. Run the migrations from the `supabase/migrations` folder:
   - User management
   - Authentication
   - Subscription plans
   - Session tracking
   - Storage configuration
3. Enable required extensions:
   - pgcrypto
   - http
   - storage

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```plaintext
nauticedge/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── profile/       # Profile management
│   │   ├── billing/       # Subscription management
│   │   ├── sections/      # Landing page sections
│   │   └── ThemeToggle.tsx # Theme switcher component
│   │   └── sections/      # Page sections
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Library configurations
│   │   └── theme.ts     # Theme management
│   ├── pages/           # Page components
│   ├── types/           # TypeScript definitions
│   └── utils/           # Utility functions
├── supabase/
│   └── migrations/      # Database migrations
├── public/             # Static assets
└── ...config files
```

## Key Features Implementation

### Authentication System
- Dark theme support for all auth flows
- Email/password authentication
- Two-factor authentication (2FA)
  - TOTP implementation
  - QR code generation
  - Recovery codes
  - Rate limiting
- Session management
  - Device fingerprinting
  - Location tracking
  - Concurrent session control
  - Automatic session cleanup

### Subscription Management
- Multiple subscription tiers
  - Basic Plan
  - Professional Plan
  - Enterprise Plan
- Plan upgrades/downgrades
- Automatic billing periods
- Feature access control
- Usage tracking

### API Access (Professional & Enterprise)
- Secure endpoints
- Rate limiting
- Plan-based access control
- Usage monitoring
- Error handling
- Logging system
- Email/password authentication
- Two-factor authentication (2FA)
  - TOTP implementation
  - QR code generation
  - Recovery codes
  - Rate limiting
- Session management
  - Device fingerprinting
  - Location tracking
  - Concurrent session control
  - Automatic session cleanup

### Profile Management
- Dark theme support
- Profile photo upload
  - Image storage in Supabase
  - Automatic cleanup of old photos
- Company information
  - Basic details
  - Address management
  - Registration info
- Personal details
  - Contact information
  - Location detection
  - Phone verification

### Billing System
- Dark theme support
- Subscription management
  - Multiple plan tiers
  - Plan upgrades/downgrades
- Payment processing
  - Card management
  - Invoice generation
  - Payment history
- Security features
  - Secure card storage
  - Payment verification

### Security Implementation

#### Two-Factor Authentication
- Dark theme support
- TOTP-based authentication
- QR code setup process
- Backup recovery codes
- Rate limiting for failed attempts
- Device verification
- TOTP-based authentication
- QR code setup process
- Backup recovery codes
- Rate limiting for failed attempts
- Device verification

#### Session Security
- Device fingerprinting
- Location tracking
- Concurrent session management
- Automatic session cleanup
- Session termination
- IP-based security
- Device fingerprinting
- Location tracking
- Concurrent session management
- Automatic session cleanup
- Session termination
- IP-based security

#### Data Protection
- Row Level Security (RLS)
- Data encryption
- Secure file storage
- Access control policies
- Rate limiting
- Input validation
- Row Level Security (RLS)
- Data encryption
- Secure file storage
- Access control policies

## Database Schema

### Core Tables
```sql
-- User related tables
users_metadata (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  email text,
  full_name text,
  company_name text
);

-- Authentication tables
user_mfa (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  secret text,
  enabled boolean
);

-- Billing tables
subscriptions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  plan text,
  status text
);
```

### Security Tables
- `mfa_verification_attempts` - 2FA attempt tracking
- `mfa_temp` - Temporary 2FA setup data
- `user_sessions` - Session management
- `api_keys` - API access management

### Views
- `user_contact_info` - Consolidated user contact details
- `subscription_status` - Current subscription information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All data is encrypted at rest and in transit
- Two-factor authentication (TOTP)
  - Compatible with Google/Microsoft Authenticator
  - Backup recovery codes
  - Rate limiting for failed attempts
- Session security
  - Device fingerprinting
  - Location tracking
  - Concurrent session management
  - Automatic session cleanup
- Regular security audits
- Compliance with maritime industry standards
- Automated backup systems

## Support

For support, email support@nauticedge.io or join our Slack channel.

## Accessibility

NauticEdge is committed to accessibility:
- WCAG 2.1 compliant
- High contrast in both light and dark themes
- Keyboard navigation support
- Screen reader friendly
- Responsive design for all devices

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
