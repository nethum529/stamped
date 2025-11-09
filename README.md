# Goldman Sachs - Client & Vendor Onboarding Platform

A beautiful, modern web application for streamlined client and vendor onboarding with automated risk assessment and compliance monitoring.

## Features

### Core Functionality
- **Dual Workflow**: Seamless client and vendor onboarding processes
- **Multi-Step Forms**: Intuitive step-by-step data collection
- **Document Management**: Drag-and-drop file uploads with preview and download
- **Smart Automation**: Automated sanctions screening and risk scoring
- **Role-Based Access**: Customized dashboards for different user roles
- **Adverse Media Monitoring**: Real-time negative news detection

### Design Excellence
- **Beautiful UI**: Apple-inspired design with rounded corners and smooth transitions
- **Consistent Design System**: Comprehensive component library with variants
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Accessible**: WCAG AA compliant with keyboard navigation support
- **Performance Optimized**: Fast load times and smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Custom component library built with Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd untitled-folder
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Login page
│   ├── dashboard/         # Dashboard pages
│   ├── clients/           # Client management
│   ├── vendors/           # Vendor management
│   ├── compliance/        # Compliance monitoring
│   └── adverse-media/     # Adverse media scanning
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components
├── lib/                   # Utility functions
└── public/                # Static assets
```

## Key Pages

### Authentication
- **Login**: Beautiful login page with form validation

### Dashboard
- **Overview**: Role-based dashboard with stats, pending tasks, and recent activity
- **Quick Actions**: Easy access to common tasks

### Client/Vendor Management
- **List View**: Searchable table with filters
- **New Entry**: Multi-step onboarding form
- **Detail View**: Comprehensive profile with tabs for overview, documents, compliance, and history

### Compliance
- **Sanctions Screening**: Real-time screening against sanctions databases
- **Risk Assessment**: ML-powered risk scoring
- **KYC Review**: Document verification workflow

### Adverse Media
- **Search**: Generate reports for any entity
- **Results**: Detailed findings with severity indicators
- **History**: Previously generated reports

## Design Principles

Following Steve Jobs' philosophy:

1. **Simplicity**: Remove everything unnecessary
2. **Clarity**: Crystal clear information hierarchy
3. **Beauty**: Every pixel is intentional
4. **Delight**: Subtle animations create joy
5. **Consistency**: Unified design language
6. **Focus**: One primary action per screen
7. **Whitespace**: Generous spacing for breathability
8. **Typography**: Beautiful and expressive text
9. **Feedback**: Immediate feedback for all actions
10. **Perfectionism**: Details matter

## Component Library

### Core Components
- **Button**: Primary, secondary, ghost, danger variants
- **Input**: Text inputs with labels and error states
- **Select**: Dropdown with search
- **Textarea**: Multi-line text input
- **Card**: Container with header, content, footer
- **Badge**: Status and category indicators
- **Modal**: Overlays with backdrop blur
- **Tabs**: Tab navigation
- **Table**: Data tables with sorting
- **Alert**: Contextual alerts
- **Progress**: Progress bars
- **Stepper**: Multi-step progress indicator
- **Timeline**: Activity timeline
- **FileUpload**: Drag-and-drop file upload
- **EmptyState**: Beautiful empty states
- **Skeleton**: Loading placeholders

### Layout Components
- **Navigation**: Sidebar navigation
- **Header**: Top header with search and notifications
- **Breadcrumbs**: Navigation hierarchy
- **DashboardShell**: Main layout wrapper

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color palette:
- Primary: Professional blue
- Success: Green
- Warning: Amber
- Error: Red
- Neutral: Gray scale

### Typography
System fonts for optimal performance and native feel.

### Spacing
8px grid system for consistent spacing.

## Performance

- **Code Splitting**: Automatic route-based splitting
- **Optimized Images**: Next.js Image component
- **60fps Animations**: GPU-accelerated transitions
- **Lazy Loading**: Components load on demand

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Clear focus states
- **Error Messages**: Accessible error communication

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 Goldman Sachs. All rights reserved.

## Support

For support, contact your system administrator or the development team.

