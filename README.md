# NauticEdge - Modern Marine Survey Platform

![NauticEdge](https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200&h=400)

NauticEdge is a comprehensive digital platform designed for marine surveyors, boat owners, and insurers. It streamlines the marine survey process with powerful digital tools, real-time collaboration features, and advanced security measures.

## 🌟 Key Features

### Survey Management
- **Digital Survey Tools**
  - Mobile-first survey capabilities
  - Offline data capture
  - Photo and video documentation
  - Real-time updates and sync
  - Custom templates
  - Version control
  - Automated backups
  - Virtual scrolling for large datasets
  - Infinite scroll loading
  - Mobile swipe gestures
  - Advanced search and filtering
  - CSV export functionality
  - Customizable views
  - Drag and drop interface
  - Real-time collaboration
  - Automated PDF generation

### Client Management
- **Comprehensive Client Profiles**
  - Contact information management
  - Survey history tracking
  - Document storage
  - Communication tools
  - Automated notifications
  - Custom fields
  - Activity logs
  - Bulk operations
  - Import/Export capabilities
  - Advanced search
  - Location detection
  - Client portal access
  - Communication history
  - Document sharing

### Invoice Management
- **Professional Invoice System**
  - Custom invoice builder
  - Multiple templates
  - PDF generation
  - Payment tracking
  - Tax calculation
  - Email notifications
  - Bulk operations
  - Payment history
  - PDF generation
  - Custom templates
  - Tax calculation
  - Multi-currency support
  - Automatic reminders
  - Payment gateway integration
  - Recurring invoices

### Appointment Scheduling
- **Advanced Calendar System**
  - Interactive calendar interface
  - Real-time availability
  - Location tracking
  - Email notifications
  - Conflict detection
  - Recurring appointments
  - Calendar sync
  - Mobile notifications
  - Location tracking
  - Conflict detection
  - Recurring appointments
  - Automated reminders
  - Multi-timezone support
  - Resource allocation
  - Team scheduling

### Security Features
- **Enhanced Authentication**
  - Email/password authentication
  - Multi-provider OAuth2 Authentication
    - Google Authentication
      - Profile synchronization
      - Automatic account linking
      - Offline access support
    - Facebook Authentication
      - Public profile access
      - Email verification
      - Profile data import
    - GitHub Authentication
      - Email verification
      - Username synchronization
      - Avatar integration
  - Two-factor authentication (2FA)
    - TOTP-based authentication
    - QR code setup
    - Recovery codes
    - Rate limiting
  - Session management
    - Device recognition
    - Location tracking
    - Concurrent session control
    - Session termination
    - IP-based security
    - Automatic cleanup
    - Device recognition
    - Location tracking
    - Concurrent session control
    - Session termination
    - IP-based security
    - Automatic cleanup
    - Suspicious activity detection
    - Geolocation verification
    - Brute force protection

- **Profile Management**
  - Profile photo upload
    - Secure storage
    - Image optimization
    - Avatar integration
  - Company information
    - Comprehensive company details
    - Registration info
    - Tax information
    - Address management
  - Personal details
    - Contact information
    - Location detection
    - Timezone management
  - Session tracking
    - Active sessions monitoring
    - Device fingerprinting
    - Location tracking
    - Session termination
    - Suspicious activity detection
    - Location tracking
    - Session termination
    - Login history
    - Security audit logs
    - Device management

### Subscription Plans
- **Basic Plan ($49/month)**
  - Core survey features
  - Basic reporting
  - Standard support
  - 5GB storage
  - Email notifications
  - Basic analytics
  - Mobile app access
  - Email support

- **Professional Plan ($99/month)**
  - Everything in Basic
  - Advanced analytics
  - Priority support
  - 50GB storage
  - API access
  - Team collaboration
  - Custom templates
  - Bulk operations
  - Advanced reporting
  - Webhook integrations
  - Custom branding
  - Priority support

- **Enterprise Plan ($249/month)**
  - Everything in Professional
  - Custom integrations
  - 24/7 support
  - Unlimited storage
  - White-label reports
  - Advanced team management
  - Custom workflows
  - SLA guarantee
  - Priority features
  - Advanced analytics
  - Custom integrations
  - White-label reports
  - Dedicated account manager
  - Custom feature development
  - Enterprise SLA

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
  - Custom hooks
  - Context API
  - Error boundaries
  - Suspense
  - Concurrent features
- Tailwind CSS for styling
  - Dark mode support
  - Custom animations
  - Responsive design
  - Custom components
- Lucide Icons
- Vite for build tooling
  - Hot module replacement
  - Optimized builds
  - Environment variables
  - TypeScript support
  - Hot module replacement
  - Optimized builds
  - Environment variables
  - TypeScript support
  - Code splitting
  - Tree shaking
  - Dynamic imports

### Backend & Infrastructure
- Supabase
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage system
  - Authentication
  - Database functions
  - Triggers
  - Policies
  - Webhooks
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Webhooks
  - Edge Functions
  - Database Backups
  - Monitoring

### Security Features
- **Comprehensive Authentication**
  - Multi-factor authentication (TOTP)
  - OAuth2 providers
  - Session management
  - Device tracking
  - Location monitoring
  - Rate limiting
  - Brute force protection
  - Password policies
  - Session management
  - Device tracking
  - Location monitoring
  - IP blocking
  - Audit logging
  - Security alerts

### API Features (Professional & Enterprise)
- RESTful endpoints
- Rate limiting
- Authentication
- OpenAPI docs
- Webhook support
- Custom integrations
- Monitoring
- Analytics
  - Rate limiting
  - Authentication
  - OpenAPI docs
  - API versioning
  - Response caching
  - Error tracking

## 📋 Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Supabase account
- OpenCage API key (for location services)
- OAuth provider credentials
  - Google
  - Facebook
  - GitHub
- Environment variables configured
- PostgreSQL 14 or higher
- Modern web browser

## 🔧 Environment Setup

1. Create a `.env` file in the root directory:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENCAGE_API_KEY=your_opencage_api_key
```

2. Configure OAuth Providers:

   a. Google OAuth Setup:
   - Create a project in Google Cloud Console
   - Configure OAuth consent screen
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     ```
     https://<your-domain>/auth/callback
     ```
   - Copy Client ID and Secret to Supabase Auth settings

   b. Facebook OAuth Setup:
   - Create a new app in Facebook Developers Console
   - Add Facebook Login product
   - Configure OAuth settings:
     - Valid OAuth Redirect URIs
     - Permissions: email, public_profile
   - Copy App ID and Secret to Supabase Auth settings

   c. GitHub OAuth Setup:
   - Register new OAuth application in GitHub
   - Set homepage URL and callback URL
   - Request scopes: user:email
   - Copy Client ID and Secret to Supabase Auth settings

3. Enable providers in Supabase:
   - Navigate to Authentication > Providers
   - Enable and configure each provider
   - Add respective Client IDs and Secrets
   - Set redirect URLs

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
- `npm run test` - Run tests
- `npm run typecheck` - Run TypeScript checks
- `npm run format` - Format code with Prettier

## 🗄️ Project Structure

```plaintext
nauticedge/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   ├── MFASetup.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── dashboard/     # Dashboard components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── DashboardContent.tsx
│   │   ├── invoice/       # Invoice components
│   │   │   ├── InvoiceList.tsx
│   │   │   ├── InvoiceBuilder.tsx
│   │   │   └── CreateInvoiceModal.tsx
│   │   ├── profile/       # Profile components
│   │   │   ├── ProfilePhoto.tsx
│   │   │   ├── CompanySection.tsx
│   │   │   └── BillingSection.tsx
│   │   ├── schedule/      # Scheduling components
│   │   │   ├── Calendar.tsx
│   │   │   └── UpcomingAppointments.tsx
│   │   └── sections/      # Landing page sections
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       └── Pricing.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAPI.ts
│   │   └── useSubscription.ts
│   ├── lib/              # Library configurations
│   │   ├── supabase.ts
│   │   ├── theme.ts
│   │   └── mfa.ts
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   └── Settings.tsx
│   ├── types/            # TypeScript definitions
│   │   ├── auth.ts
│   │   └── supabase.ts
│   └── utils/            # Utility functions
│       ├── auth.ts
│       ├── browser.ts
│       └── location.ts
├── supabase/
│   └── migrations/       # Database migrations
└── public/              # Static assets
```

## 🔒 Security Features

- Two-factor authentication (TOTP)
- Comprehensive OAuth2 Integration
  - Multiple provider support
  - Secure authentication flow
  - Profile synchronization
  - Automatic account linking
  - Configurable scopes
  - Fallback authentication
  - Session persistence
  - Token refresh handling
- Advanced Session Management
  - Device fingerprinting
  - Location tracking
  - Active session monitoring
  - Remote session termination
  - Concurrent session control
  - Session timeout policies
  - Suspicious activity detection
- Data Protection
  - Row Level Security (RLS)
  - Data encryption
  - Secure file storage
  - Access control policies
  - Input validation
  - SQL injection prevention
  - XSS protection
  - CSRF protection
- Rate Limiting
- IP Blocking
- Audit Logging
- Security Headers

## 🔌 API Integration

### API Features
- RESTful endpoints
- Rate limiting
- Authentication & authorization
- OpenAPI documentation
- Webhook support
  - Custom events
  - Retry logic
  - Error handling
  - Delivery tracking

### API Security
- API key management
- Request signing
- Rate limiting
- IP whitelisting
- Audit logging
- Error handling
- Input validation
- Request validation
- Response sanitization
- Security headers

## 📱 Mobile Support

- Responsive design
- Touch-optimized UI
- Offline capabilities
- Push notifications
- Mobile-first features
- Cross-device sync
- Progressive loading
- Native app features
- Gesture support
- Mobile optimizations

## 🎨 UI/UX Features

- Dark/Light theme
- Responsive layouts
- Animated transitions
- Loading states
- Error handling
- Form validation
- Toast notifications
- Modal dialogs
- Drag and drop
- Infinite scroll
- Virtual lists

## 🔄 Real-time Features

- Live updates
- Collaborative editing
- Status indicators
- Activity feeds
- Notifications
- Data synchronization
- Presence indicators
- WebSocket support
- Offline sync
- Conflict resolution

## 📊 Analytics & Reporting

- Custom dashboards
- Export options
- Data visualization
- Trend analysis
- Performance metrics
- Usage statistics
- Custom reports
- Advanced filters
- Scheduled reports
- Report templates

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
- [Vite](https://vitejs.dev/) for build tooling
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [date-fns](https://date-fns.org/) for date manipulation