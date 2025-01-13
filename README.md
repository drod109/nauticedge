# NauticEdge - Modern Marine Survey Platform

![NauticEdge](https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200&h=400)

NauticEdge is a comprehensive digital platform designed for marine surveyors, boat owners, and insurers. It streamlines the marine survey process with powerful digital tools and real-time collaboration features.

## Features

- **Digital Survey Tools**
  - Mobile-first survey capabilities
  - Offline data capture
  - Photo and video documentation
  - Real-time updates and sync

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

- **Security & Compliance**
  - Bank-grade encryption
  - Two-factor authentication
    - TOTP-based authentication
    - Recovery codes
    - Rate limiting
    - Device tracking
  - Role-based access control
  - Industry compliance tools
  - Session management
    - Device recognition
    - Location tracking
    - Concurrent session control

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - Vite

- **Backend**
  - Supabase
  - PostgreSQL
  - Row Level Security
  - Real-time subscriptions

- **Authentication**
  - Supabase Auth
  - Email/Password
  - Multi-factor authentication (TOTP)
  - Microsoft/Google Authenticator support
  - Session management
  - Device tracking
  - Location-based security

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Supabase account
- OpenCage API key (for location services)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

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
2. Run the migrations from the `supabase/migrations` folder
3. Enable the required extensions in Supabase
4. Configure Row Level Security policies

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
nauticedge/
├── src/
│   ├── components/     # Reusable components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Library configurations
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── supabase/
│   └── migrations/    # Database migrations
├── public/            # Static assets
└── ...config files
```

## Key Features Implementation

### Authentication Flow
- Email/password authentication
- Session management
  - Device fingerprinting
  - Location tracking
  - Concurrent session handling
  - Session termination
- Device tracking
- Multi-Factor Authentication
  - TOTP-based authentication
  - QR code setup
  - Recovery codes
  - Rate limiting
  - Device verification

### Survey Management
- Create and edit surveys
- Real-time collaboration
- Offline support
- Photo/video attachments

### Client Portal
- Client dashboard
- Document sharing
- Communication tools
- Payment processing

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

For support, email support@nauticedge.com or join our Slack channel.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- [OpenCage](https://opencagedata.com/) for geocoding services