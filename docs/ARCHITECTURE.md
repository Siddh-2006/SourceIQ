# SourceIQ Architecture Documentation

## System Overview

SourceIQ is built as a modern, scalable web application with a focus on performance, reliability, and maintainability. The architecture follows industry best practices for enterprise-grade applications.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │  External APIs  │
│   (React/TS)    │◄──►│   (Services)    │◄──►│  GitHub/Gemini  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │  Business Logic │    │   Data Sources  │
│   Dashboard     │    │  Analysis Engine│    │   GitHub Repos  │
│   Charts        │    │  AI Processing  │    │   AI Models     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App.tsx
├── Dashboard.tsx (Main analysis view)
│   ├── RadarView.tsx (Performance visualization)
│   ├── ModuleCards.tsx (Feature analysis cards)
│   └── RecommendationPanel.tsx (Action items)
└── AnalysisForm.tsx (Repository input)
```

### State Management

- **Local State**: React hooks (useState, useEffect)
- **Props Drilling**: Minimal, focused component communication
- **Context**: Not used (application is simple enough)
- **External State**: API responses cached in component state

### Styling Architecture

```
index.css (Global styles)
├── Tailwind CSS (Utility classes)
├── Custom CSS Variables (Theme colors)
└── Component-specific styles (Inline when needed)
```

## Backend Services Architecture

### Service Layer Pattern

```typescript
// Service abstraction
interface AnalysisService {
  analyzeRepository(url: string): Promise<FullReport>;
  chatWithRepository(messages: ChatMessage[]): Promise<string>;
}

// Implementation
class GeminiAnalysisService implements AnalysisService {
  private githubService: GitHubService;
  private aiService: AIService;
}
```

### API Integration Layer

#### GitHub Service
```typescript
class GitHubService {
  // Repository data fetching
  async getRepositoryData(owner: string, repo: string): Promise<GitHubRepoAnalysis>
  
  // Utility methods
  parseRepoUrl(url: string): { owner: string; repo: string } | null
  private checkForTests(contents: any[]): boolean
  private checkForCI(contents: any[]): boolean
}
```

#### AI Service (Gemini)
```typescript
class AIService {
  // Multi-key management
  private apiKeyManager: APIKeyManager;
  
  // Parallel processing
  async analyzeAllFeatures(repoUrl: string): Promise<AnalysisResults>
  
  // Fallback handling
  private async callGeminiWithSpecificKey(prompt: string, keyIndex: number): Promise<string>
}
```

## Data Flow Architecture

### Analysis Pipeline

```
1. User Input (GitHub URL)
   ↓
2. URL Validation & Parsing
   ↓
3. GitHub API Data Fetching
   ├── Repository metadata
   ├── Language statistics
   ├── Commit history
   ├── Contributors
   ├── File structure
   └── README/package.json
   ↓
4. AI Analysis (Parallel Processing)
   ├── Prompt 1: Structure Analysis
   ├── Prompt 2: Code Quality
   ├── Prompt 3: Documentation
   ├── ...
   └── Prompt 11: Business Alignment
   ↓
5. Results Aggregation
   ↓
6. Report Generation
   ↓
7. UI Rendering
```

### Error Handling Flow

```
API Call
   ↓
Error Occurs?
   ├── Yes → Classify Error Type
   │   ├── Rate Limit → Try Next API Key
   │   ├── Invalid Key → Skip Key
   │   ├── Service Overload → Wait & Retry
   │   └── Network Error → Retry with Delay
   └── No → Process Response
```

## Performance Architecture

### Parallel Processing Strategy

```typescript
// 11 prompts distributed across N API keys
const promises = prompts.map(async (prompt, index) => {
  const keyIndex = index % apiKeys.length;
  return callGeminiWithSpecificKey(prompt, keyIndex);
});

const results = await Promise.allSettled(promises);
```

### Caching Strategy

- **Browser Cache**: Static assets (CSS, JS, images)
- **Memory Cache**: API responses during session
- **No Persistent Cache**: Always fresh data from GitHub

### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
```

## Security Architecture

### API Key Management

```typescript
class APIKeyManager {
  private apiKeys: string[];
  private currentKeyIndex: number = 0;
  private failedKeys: Set<number> = new Set();
  
  // Rotation logic
  getNextKey(): string | null
  markCurrentKeyAsFailed(): void
  resetFailedKeys(): void
}
```

### Environment Variable Security

```bash
# Development
.env.local (gitignored)

# Production
Vercel Environment Variables (encrypted)
```

### Input Validation

```typescript
// URL validation
const parseRepoUrl = (url: string): { owner: string; repo: string } | null => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
};
```

## Deployment Architecture

### Vercel Configuration

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### Environment Strategy

```
Development → .env.local
Staging → Vercel Preview Environment
Production → Vercel Production Environment
```

### Build Pipeline

```
1. Code Push to GitHub
   ↓
2. Vercel Webhook Trigger
   ↓
3. Install Dependencies (npm install)
   ↓
4. Type Checking (tsc --noEmit)
   ↓
5. Build Application (vite build)
   ↓
6. Deploy to Edge Network
   ↓
7. Health Check & Monitoring
```

## Monitoring & Observability

### Error Tracking

```typescript
// Production error handling
try {
  await analyzeRepository(url);
} catch (error) {
  // Log to monitoring service
  console.error('Analysis failed:', error);
  
  // Fallback to mock data
  return getMockAnalysisData(url);
}
```

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS tracking
- **API Response Times**: GitHub and Gemini API latency
- **Error Rates**: Failed analysis percentage
- **User Experience**: Success/failure rates

### Health Checks

```typescript
// API health check
const healthCheck = async (): Promise<boolean> => {
  try {
    await fetch('https://api.github.com/rate_limit');
    return true;
  } catch {
    return false;
  }
};
```

## Scalability Considerations

### Horizontal Scaling

- **Stateless Design**: No server-side state
- **Edge Deployment**: Global CDN distribution
- **API Key Pool**: Multiple keys for higher throughput

### Vertical Scaling

- **Parallel Processing**: Multiple concurrent AI requests
- **Efficient Algorithms**: Optimized data processing
- **Memory Management**: Proper cleanup and garbage collection

### Load Balancing

```typescript
// API key load balancing
const distributeLoad = (requests: Request[], keys: string[]) => {
  return requests.map((request, index) => ({
    request,
    keyIndex: index % keys.length
  }));
};
```

## Technology Stack Rationale

### Frontend Choices

- **React 18**: Concurrent features, excellent ecosystem
- **TypeScript**: Type safety, better developer experience
- **Vite**: Fast builds, excellent dev experience
- **Tailwind CSS**: Utility-first, consistent design system

### Backend Choices

- **Serverless**: No infrastructure management
- **GitHub API**: Authoritative source for repository data
- **Google Gemini**: Advanced AI capabilities, good rate limits

### Infrastructure Choices

- **Vercel**: Excellent React support, global edge network
- **Environment Variables**: Secure configuration management
- **Git-based Deployment**: Automated CI/CD pipeline

## Future Architecture Considerations

### Potential Enhancements

1. **Database Layer**: For caching and user preferences
2. **Authentication**: User accounts and private repo access
3. **Real-time Updates**: WebSocket connections for live analysis
4. **Microservices**: Separate analysis engines for different languages
5. **Machine Learning**: Custom models for specific analysis types

### Scalability Roadmap

1. **Phase 1**: Current architecture (up to 10K analyses/month)
2. **Phase 2**: Add caching layer (up to 100K analyses/month)
3. **Phase 3**: Microservices architecture (up to 1M analyses/month)
4. **Phase 4**: Custom AI models (enterprise scale)

This architecture provides a solid foundation for a production-ready application while maintaining flexibility for future enhancements and scaling requirements.