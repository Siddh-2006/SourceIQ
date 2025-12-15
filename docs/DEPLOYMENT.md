# SourceIQ Deployment Guide

## Production Deployment

### 🚀 **Vercel Deployment (Recommended)**

#### Prerequisites
- Vercel account
- GitHub repository
- 10+ Gemini API keys
- GitHub Personal Access Token (optional but recommended)

#### Step 1: Environment Configuration
```bash
# Required Environment Variables
VITE_GEMINI_API_KEY=key1,key2,key3,key4,key5,key6,key7,key8,key9,key10
VITE_GITHUB_TOKEN=ghp_your_personal_access_token_here
```

#### Step 2: Vercel Setup
1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select "Vite" as framework preset

2. **Configure Environment Variables**:
   ```bash
   # In Vercel Dashboard → Settings → Environment Variables
   VITE_GEMINI_API_KEY = key1,key2,key3,key4,key5,key6,key7,key8,key9,key10
   VITE_GITHUB_TOKEN = ghp_your_token_here
   ```

3. **Deploy**:
   ```bash
   # Automatic deployment on git push
   git push origin main
   ```

#### Step 3: Custom Domain (Optional)
```bash
# In Vercel Dashboard → Settings → Domains
# Add your custom domain: sourceiq.yourdomain.com
```

#### Vercel Configuration (`vercel.json`)
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "VITE_GEMINI_API_KEY": "@gemini-api-keys",
    "VITE_GITHUB_TOKEN": "@github-token"
  },
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.github.com https://generativelanguage.googleapis.com; img-src 'self' data: https:; font-src 'self' data:;"
        }
      ]
    }
  ]
}
```

---

### 🌐 **Netlify Deployment**

#### Step 1: Build Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.github.com https://generativelanguage.googleapis.com; img-src 'self' data: https:; font-src 'self' data:;"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Environment Variables
```bash
# In Netlify Dashboard → Site Settings → Environment Variables
VITE_GEMINI_API_KEY = key1,key2,key3,key4,key5,key6,key7,key8,key9,key10
VITE_GITHUB_TOKEN = ghp_your_token_here
```

#### Step 3: Deploy
```bash
# Connect GitHub repository in Netlify dashboard
# Automatic deployment on git push
```

---

### 🐳 **Docker Deployment**

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Security headers
COPY <<EOF /etc/nginx/conf.d/security.conf
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.github.com https://generativelanguage.googleapis.com; img-src 'self' data: https:; font-src 'self' data:;" always;
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  sourceiq:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
      - VITE_GITHUB_TOKEN=${VITE_GITHUB_TOKEN}
    restart: unless-stopped
    
  # Optional: Add monitoring
  monitoring:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

#### Deploy with Docker
```bash
# Build and run
docker build -t sourceiq .
docker run -p 80:80 \
  -e VITE_GEMINI_API_KEY="key1,key2,key3" \
  -e VITE_GITHUB_TOKEN="ghp_token" \
  sourceiq

# Or use docker-compose
docker-compose up -d
```

---

### ☁️ **AWS Deployment**

#### S3 + CloudFront Setup
```bash
# 1. Create S3 bucket
aws s3 mb s3://sourceiq-app

# 2. Build and upload
npm run build
aws s3 sync dist/ s3://sourceiq-app --delete

# 3. Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

#### CloudFront Configuration
```json
{
  "CallerReference": "sourceiq-deployment",
  "Comment": "SourceIQ Application",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-sourceiq-app",
        "DomainName": "sourceiq-app.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-sourceiq-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200"
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

---

### 🔧 **Environment Management**

#### Development Environment
```bash
# .env.local
VITE_GEMINI_API_KEY=dev_key1,dev_key2,dev_key3
VITE_GITHUB_TOKEN=ghp_dev_token
NODE_ENV=development
```

#### Staging Environment
```bash
# .env.staging
VITE_GEMINI_API_KEY=staging_key1,staging_key2,staging_key3
VITE_GITHUB_TOKEN=ghp_staging_token
NODE_ENV=production
```

#### Production Environment
```bash
# .env.production
VITE_GEMINI_API_KEY=prod_key1,prod_key2,prod_key3,prod_key4,prod_key5,prod_key6,prod_key7,prod_key8,prod_key9,prod_key10
VITE_GITHUB_TOKEN=ghp_prod_token
NODE_ENV=production
```

#### Environment Validation
```typescript
// src/config/environment.ts
export const validateEnvironment = () => {
  const apiKeys = import.meta.env.VITE_GEMINI_API_KEY?.split(',') || [];
  
  if (apiKeys.length === 0) {
    throw new Error('VITE_GEMINI_API_KEY is required');
  }
  
  if (apiKeys.length < 3) {
    console.warn('Recommended: Use at least 3 API keys for better performance');
  }
  
  if (apiKeys.length < 10 && import.meta.env.PROD) {
    console.warn('Production: Use 10+ API keys for optimal performance');
  }
  
  return {
    apiKeys: apiKeys.filter(key => key.trim().length > 0),
    githubToken: import.meta.env.VITE_GITHUB_TOKEN,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD
  };
};
```

---

### 📊 **Performance Optimization**

#### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'clsx'],
          charts: ['recharts'],
          ai: ['@google/generative-ai']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    react(),
    // Add compression
    {
      name: 'gzip',
      generateBundle() {
        // Gzip compression logic
      }
    }
  ]
});
```

#### CDN Configuration
```typescript
// Use CDN for static assets
const CDN_BASE = 'https://cdn.yourdomain.com';

// In production, serve assets from CDN
if (import.meta.env.PROD) {
  // Configure asset URLs
}
```

---

### 🔐 **Security Configuration**

#### Content Security Policy
```typescript
// Strict CSP for production
const CSP = `
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' 
    https://api.github.com 
    https://generativelanguage.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s+/g, ' ').trim();
```

#### API Key Security
```typescript
// Rotate API keys regularly
const rotateApiKeys = () => {
  // Implement key rotation strategy
  // Update environment variables
  // Redeploy application
};

// Monitor for compromised keys
const monitorApiUsage = () => {
  // Track unusual usage patterns
  // Alert on suspicious activity
  // Automatically disable compromised keys
};
```

---

### 📈 **Monitoring & Analytics**

#### Health Checks
```typescript
// src/utils/healthCheck.ts
export const healthCheck = async () => {
  const checks = {
    apiKeys: checkApiKeys(),
    github: checkGitHubAPI(),
    gemini: checkGeminiAPI(),
    performance: checkPerformance()
  };
  
  return {
    status: Object.values(checks).every(check => check.healthy) ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  };
};
```

#### Performance Monitoring
```typescript
// Track key metrics
const metrics = {
  analysisSuccessRate: 0.95,
  averageAnalysisTime: 45000, // 45 seconds
  apiKeyDistribution: {},
  errorRate: 0.02
};

// Send to monitoring service
const sendMetrics = (metrics) => {
  // Send to DataDog, New Relic, etc.
};
```

#### Error Tracking
```typescript
// src/utils/errorTracking.ts
export const trackError = (error: Error, context: any) => {
  // Send to Sentry, Bugsnag, etc.
  console.error('Error tracked:', error, context);
};
```

---

### 🚨 **Disaster Recovery**

#### Backup Strategy
```bash
# Backup configuration
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0

# Backup environment variables
echo "VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY" > backup.env
echo "VITE_GITHUB_TOKEN=$VITE_GITHUB_TOKEN" >> backup.env
```

#### Rollback Procedure
```bash
# Quick rollback to previous version
git checkout v1.0.0
npm run build
# Deploy to production
```

#### Failover Strategy
```typescript
// Multiple deployment regions
const deploymentRegions = [
  'us-east-1',  // Primary
  'us-west-2',  // Secondary
  'eu-west-1'   // Tertiary
];

// Automatic failover logic
const checkRegionHealth = async (region) => {
  // Health check implementation
};
```

---

### 📋 **Deployment Checklist**

#### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] API keys validated (10+ keys recommended)
- [ ] GitHub token configured
- [ ] Build optimization enabled
- [ ] Security headers configured
- [ ] CSP policy defined
- [ ] Error tracking setup
- [ ] Performance monitoring enabled

#### Post-Deployment
- [ ] Health check passing
- [ ] All API endpoints responding
- [ ] Analysis workflow working
- [ ] Dashboard loading correctly
- [ ] Error rates within acceptable limits
- [ ] Performance metrics meeting targets
- [ ] Security scan completed
- [ ] Backup procedures tested

#### Monitoring Setup
- [ ] Uptime monitoring configured
- [ ] Error rate alerts setup
- [ ] Performance threshold alerts
- [ ] API usage monitoring
- [ ] Security incident alerts
- [ ] Automated health checks

---

This deployment guide ensures a robust, secure, and scalable production deployment of SourceIQ with comprehensive monitoring and disaster recovery procedures.