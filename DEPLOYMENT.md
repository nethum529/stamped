# Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Git repository access
- Vercel/Netlify/AWS account (recommended platforms)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Start Production Server

```bash
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform as it's built by the Next.js team.

#### Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure settings (auto-detected for Next.js)
6. Click "Deploy"

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t goldman-onboarding .
docker run -p 3000:3000 goldman-onboarding
```

### Option 4: AWS (EC2, S3 + CloudFront, or Amplify)

#### AWS Amplify (Easiest)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### AWS EC2

1. Launch EC2 instance (Ubuntu recommended)
2. SSH into instance
3. Install Node.js and npm
4. Clone repository
5. Install dependencies and build
6. Use PM2 to keep app running:

```bash
npm install -g pm2
pm2 start npm --name "goldman-onboarding" -- start
pm2 save
pm2 startup
```

## Environment Variables

Create a `.env.local` file for sensitive configuration:

```env
# API Endpoints
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key

# File Storage
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# External APIs
SANCTIONS_API_KEY=your-sanctions-api-key
NEWS_API_KEY=your-news-api-key

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
```

## Database Setup

### PostgreSQL Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name VARCHAR(255) NOT NULL,
  trading_name VARCHAR(255),
  entity_type VARCHAR(100),
  registration_number VARCHAR(100),
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  risk_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendors
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  risk_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Screening Results
CREATE TABLE screening_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  status VARCHAR(50),
  result VARCHAR(50),
  matches_found INTEGER DEFAULT 0,
  confidence VARCHAR(50),
  screened_at TIMESTAMP DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  action VARCHAR(255) NOT NULL,
  description TEXT,
  performed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## SSL/TLS Certificate

For production, always use HTTPS:

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificate will be at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Configure Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### CDN Configuration

Use a CDN for static assets:
- Cloudflare (Free tier available)
- AWS CloudFront
- Fastly

### Caching Strategy

Configure appropriate cache headers:

```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Monitoring & Logging

### Recommended Services

- **Error Tracking**: Sentry
- **Performance Monitoring**: Vercel Analytics, New Relic
- **Logging**: Logtail, Datadog
- **Uptime Monitoring**: UptimeRobot, Pingdom

### Setup Sentry

```bash
npm install @sentry/nextjs
```

```js
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

## Backup Strategy

1. **Database**: Daily automated backups
2. **Files**: Replicated across regions in S3
3. **Code**: Version controlled in Git
4. **Configuration**: Documented and version controlled

## Security Checklist

- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] API keys rotated regularly
- [ ] Database credentials encrypted
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Security headers configured
- [ ] Regular dependency updates
- [ ] Penetration testing completed

## Rollback Procedure

If deployment fails:

1. **Vercel**: Instantly rollback to previous deployment in dashboard
2. **Manual**: 
   ```bash
   git revert HEAD
   git push origin main
   ```
3. **Docker**: Keep previous image tagged:
   ```bash
   docker tag goldman-onboarding:latest goldman-onboarding:backup
   ```

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] All pages are accessible
- [ ] Forms submit successfully
- [ ] File uploads work
- [ ] Authentication functions
- [ ] API endpoints respond
- [ ] Mobile view works
- [ ] Performance metrics acceptable
- [ ] Error tracking active
- [ ] SSL certificate valid
- [ ] DNS properly configured
- [ ] Monitoring alerts set up

## Support & Maintenance

### Regular Tasks

- **Weekly**: Review error logs
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: SSL certificate renewal (if not automatic)

### Emergency Contacts

Maintain a contact list for:
- DevOps team
- Database administrator
- Security team
- Platform support (Vercel, AWS, etc.)

---

Your application is now ready for production deployment! 🚀

