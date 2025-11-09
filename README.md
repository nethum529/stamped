# Stamped - Secure & Intelligent Onboarding Hub

**Status:** ✅ **80% Complete - Demo Ready**

A comprehensive compliance and onboarding platform built with Next.js 13+, TypeScript, Tailwind CSS, and Framer Motion.

---

## ✨ Features

### 🎨 **Beautiful, Investor-Ready Design**
- Professional teal/turquoise/navy color scheme
- Smooth, slow animations throughout
- Glassmorphism and modern UI effects
- Typewriter hero headline animation
- Consistent branding with integrated logo

### 👥 **Multi-Role Portals**

#### **Client Portal**
- Dashboard with onboarding status
- Drag-and-drop document upload
- Real-time chat with officers
- AI chatbot assistant
- Profile management

#### **Relationship Manager**  
- Lead management with AI scoring (0-100)
- Kanban pipeline board (drag & drop)
- Pipeline analytics & conversion metrics
- Top prospects dashboard
- New lead creation

#### **Compliance Officer**
- Document review workflow (approve/reject)
- PDF/image annotation tools
- Risk assessment dashboard
- Pending reviews & high-risk alerts

#### **Risk Analyst**
- Risk distribution charts
- Detailed entity analysis
- Adverse media & sanctions screening
- Report generation & scheduling
- Geographic risk heatmaps

#### **Executive**
- High-level KPIs dashboard
- Revenue & pipeline trends
- Top performer rankings
- AI-powered strategic insights
- Market trend analysis

### 🤖 **AI Features**
- **AI Lead Scoring**: Automated scoring with detailed breakdown
- **AI Chatbot**: Context-aware assistant for clients
- **AI Insights**: Market trends, risk predictions, growth opportunities

### 🔔 **Real-time Features**
- Notification center with unread badges
- Mark as read / delete notifications
- Action links from notifications
- Persistent chat history (localStorage)

### 📊 **Comprehensive Data Models**
- 20+ mock leads with realistic data
- Multiple clients, vendors, documents
- Risk scores with detailed breakdowns
- Messages & conversations
- Centralized mock service with API delays

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000`

---

## 📁 Project Structure

```
stamped/
├── app/                      # Next.js 13+ App Router
│   ├── (landing)/           # Landing page
│   ├── client-portal/       # Client portal pages
│   ├── leads/               # Lead management
│   ├── compliance/          # Compliance officer portal
│   ├── risk-analyst/        # Risk analyst portal
│   └── executive/           # Executive dashboard
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Layout components
│   ├── leads/               # Lead-specific components
│   ├── compliance/          # Compliance components
│   ├── client-portal/       # Client portal components
│   ├── notifications/       # Notification center
│   └── ai-chatbot/          # AI chatbot
├── lib/                     # Utilities & services
│   ├── types/               # TypeScript types
│   ├── services/            # Mock services & AI
│   ├── mock-data/           # Mock data generators
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

---

## 🎯 Key Pages

### Landing & Auth
- `/` - Landing page with hero, features, process
- `/login` - Main login
- `/client-login` - Client-specific login
- `/employee-login` - Employee-specific login
- `/signup` - Registration

### Client Portal
- `/client-portal/dashboard` - Onboarding status
- `/client-portal/documents` - Upload & track documents
- `/client-portal/messages` - Chat with officer
- `/client-portal/profile` - Profile management

### Employee Portals
- `/dashboard` - Relationship Manager dashboard
- `/leads` - Lead list with filters
- `/leads/pipeline` - Kanban board
- `/compliance/documents` - Document review
- `/compliance/risk-assessment` - Risk scores
- `/risk-analyst/dashboard` - Risk metrics
- `/risk-analyst/analysis/[id]` - Detailed analysis
- `/risk-analyst/reports` - Report generation
- `/executive/dashboard` - Executive KPIs
- `/executive/insights` - Strategic insights

---

## 🎨 Design System

### Colors
- **Primary**: Teal (#14b8a6)
- **Turquoise**: #06b6d4
- **Navy**: #0f172a
- **Neutral**: Grays (#f9fafb to #0f172a)

### Typography
- **Sans-serif**: Inter (internal pages)
- **Serif**: Playfair Display (landing headings)

### Animations
- Framer Motion throughout
- Slow, smooth transitions (0.3-0.8s)
- Typewriter effect on hero
- Fade-in, slide-up, scale animations

---

## 🔧 Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **File Upload**: react-dropzone
- **Utilities**: class-variance-authority, clsx

---

## ⚠️ Important Notes

### Mock Data
- All features use **mock data** for demonstration
- No actual backend or database connected
- File uploads are simulated (no storage)
- Authentication is mock (no real auth)

### AI Features
- AI lead scoring uses **rule-based logic** (no ML models)
- Chatbot uses **predefined responses** (no NLP)
- AI insights are **manually curated** (no actual AI)

### Real-time Features
- Notifications are **simulated** (no WebSocket)
- Chat history uses **localStorage** (no persistence)

---

## 📝 Next Steps

### For MVP Launch
1. Connect to real backend API
2. Implement actual authentication
3. Add file storage (S3, etc.)
4. Add error boundaries
5. Complete mobile testing

### Future Enhancements
1. Role-based route protection
2. Real-time WebSocket connection
3. Actual ML models for AI features
4. Lifecycle management automation
5. Workflow automation triggers
6. Performance optimization
7. Comprehensive documentation

---

## 📄 License

Proprietary - Stamped Inc.

---

## 👨‍💻 Development

Built with passion and attention to detail.

**Every pixel matters.** ✨

---

*Last Updated: November 9, 2025*
