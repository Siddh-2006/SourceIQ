# SourceIQ - Repository Intelligence Platform

> **Transform your repository into actionable intelligence. Analyze structure, security, and scalability to get a CTO-level blueprint in seconds.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/sourceiq)

## 🚀 Overview

SourceIQ is an enterprise-grade repository analysis platform that provides comprehensive technical audits of GitHub repositories. Using advanced AI analysis combined with real GitHub API data, it delivers detailed insights across 10 critical dimensions of software quality.

### Key Features

- **🔍 Real-Time Analysis** - Fetches live data from GitHub API for accurate assessments
- **🤖 AI-Powered Insights** - Uses Google Gemini AI with parallel processing across multiple API keys
- **📊 10 Macro Features** - Comprehensive analysis across structure, security, performance, and more
- **⚡ High Performance** - Parallel API calls with intelligent fallback systems
- **🎯 Production Ready** - Built for scale with proper error handling and monitoring

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety and developer experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization and charts
- **Lucide React** - Modern icon library

### Backend Services
- **GitHub API Integration** - Real repository data fetching
- **Google Gemini AI** - Advanced language model for analysis
- **Multi-Key Management** - Intelligent API key rotation and fallback

### Infrastructure
- **Vercel** - Serverless deployment platform
- **Edge Functions** - Global CDN and edge computing
- **Environment Variables** - Secure configuration management

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- GitHub Personal Access Token (optional but recommended)
- Google Gemini API Keys (1-10 keys for optimal performance)

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/sourceiq.git
cd sourceiq
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
# Gemini API Configuration (Required)
# Get your API keys from: https://makersuite.google.com/app/apikey
# You can add multiple keys separated by commas for better reliability
GEMINI_API_KEY=your_api_key_1,your_api_key_2,your_api_key_3,your_api_key_4,your_api_key_5

# GitHub API Configuration (Optional but Recommended)
# Get your token from: https://github.com/settings/tokens
# This enables higher rate limits and access to private repos
# Without this token, you're limited to 60 requests/hour
GITHUB_TOKEN=your_github_personal_access_token
```

### 4. Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see the application.

## 🔧 Configuration

### API Key Management

#### Gemini API Keys
- **Single Key**: Basic functionality with rate limits
- **Multiple Keys**: Enhanced performance and reliability
- **Recommended**: 5-10 keys for production use
- **Fallback System**: Automatic key rotation on failures

#### GitHub Token
- **Without Token**: 60 requests/hour (public repos only)
- **With Token**: 5,000 requests/hour + private repo access
- **Scopes Needed**: `public_repo` (or `repo` for private access)

### Performance Tuning

#### Parallel Processing
- Distributes 11 analysis prompts across available API keys
- Intelligent load balancing and error recovery
- Configurable timeout and retry mechanisms

#### Caching Strategy
- Repository metadata caching
- API response optimization
- Efficient data serialization

## 📊 Analysis Features

### 10 Macro Feature Analysis

1. **🏗️ Structural Integrity**
   - Directory organization and architecture patterns
   - Module coupling and dependency analysis
   - Build system configuration

2. **💻 Code Quality & Maintainability**
   - Code standards and formatting
   - Design patterns and SOLID principles
   - Technical debt assessment

3. **📖 Documentation & Knowledge Transfer**
   - README quality and completeness
   - Code documentation and API docs
   - Contributing guidelines

4. **🧪 Testing & Reliability**
   - Test coverage and framework analysis
   - CI/CD integration assessment
   - Quality assurance practices

5. **📝 Version Control Discipline**
   - Commit history and message quality
   - Branching strategy evaluation
   - Collaboration patterns

6. **🔒 Security & Vulnerability Assessment**
   - Authentication and authorization review
   - Dependency vulnerability scanning
   - Security best practices audit

7. **⚡ Performance & Scalability**
   - Code efficiency analysis
   - Scalability pattern assessment
   - Performance optimization opportunities

8. **📦 Dependency Management**
   - Package health and security
   - Supply chain risk assessment
   - Update strategy evaluation

9. **🚀 Deployment & DevOps Maturity**
   - CI/CD pipeline assessment
   - Infrastructure configuration review
   - Monitoring and alerting setup

10. **💼 Business Alignment & Product Strategy**
    - Product-market fit analysis
    - Growth potential assessment
    - Cost efficiency evaluation

## 🛠️ Development

### Project Structure
```
sourceiq/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard component
│   │   └── RadarView.tsx    # Data visualization
│   ├── services/            # API services
│   │   └── geminiService.ts # AI and GitHub integration
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Type definitions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── docs/                    # Documentation
├── .env.example             # Environment template
├── vercel.json              # Deployment configuration
├── vite.config.ts           # Build configuration
└── package.json             # Dependencies and scripts
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Deployment
npm run deploy       # Deploy to Vercel
```

### Code Quality Standards

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure API keys are properly configured

3. **Build Configuration**
   - Automatic builds on git push
   - Edge function optimization
   - Global CDN distribution

### Manual Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy to Static Host**
   - Upload `dist/` folder to your hosting provider
   - Configure environment variables
   - Set up custom domain (optional)

## 🔒 Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate keys regularly for enhanced security
- Monitor API usage and set up alerts

### GitHub Token Security
- Use minimal required scopes
- Generate tokens with expiration dates
- Monitor token usage in GitHub settings
- Revoke unused or compromised tokens

### Application Security
- Input validation on all user inputs
- Rate limiting on API endpoints
- HTTPS enforcement in production
- Content Security Policy headers

## 📈 Performance Optimization

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization and compression
- Bundle size analysis and reduction
- Caching strategies for static assets

### API Optimization
- Parallel request processing
- Intelligent retry mechanisms
- Response caching and memoization
- Error boundary implementation

### Monitoring & Analytics
- Performance metrics tracking
- Error logging and alerting
- User experience monitoring
- API usage analytics

## 🤝 Contributing

### Development Workflow

1. **Fork Repository**
   ```bash
   git clone https://github.com/your-username/sourceiq.git
   cd sourceiq
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development Setup**
   ```bash
   npm install
   cp .env.example .env.local
   # Add your API keys to .env.local
   npm run dev
   ```

4. **Code Quality Checks**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

5. **Submit Pull Request**
   - Ensure all tests pass
   - Update documentation if needed
   - Follow conventional commit messages

### Coding Standards

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **Testing**: Jest and React Testing Library
- **Documentation**: JSDoc comments for complex functions

## 📚 API Reference

### GitHub Service

```typescript
class GitHubService {
  async getRepositoryData(owner: string, repo: string): Promise<GitHubRepoAnalysis>
  parseRepoUrl(url: string): { owner: string; repo: string } | null
}
```

### Gemini Service

```typescript
async function analyzeRepo(repoUrl: string): Promise<FullReport>
async function chatWithRepo(messages: ChatMessage[], repoUrl: string): Promise<string>
```

### Type Definitions

```typescript
interface FullReport {
  repo_metadata: RepoMetadata;
  critical_flags: CriticalFlags;
  home_page: HomePageData;
  modules: ModuleMap;
  improvement_roadmap: ImprovementItem[];
}
```

## 🐛 Troubleshooting

### Common Issues

#### API Rate Limits
- **Problem**: "Rate limit exceeded" errors
- **Solution**: Add more API keys or GitHub token
- **Prevention**: Monitor usage and implement caching

#### Build Failures
- **Problem**: TypeScript compilation errors
- **Solution**: Run `npm run type-check` and fix type issues
- **Prevention**: Use strict TypeScript configuration

#### Deployment Issues
- **Problem**: Environment variables not working
- **Solution**: Verify Vercel environment variable configuration
- **Prevention**: Test with production build locally

### Debug Mode

Enable debug logging in development:
```typescript
// In development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - Advanced language model capabilities
- **GitHub API** - Repository data and metadata
- **Vercel** - Deployment and hosting platform
- **React Community** - Framework and ecosystem
- **Open Source Contributors** - Various libraries and tools

## 📞 Support

- **Documentation**: [docs.sourceiq.dev](https://docs.sourceiq.dev)
- **Issues**: [GitHub Issues](https://github.com/your-username/sourceiq/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/sourceiq/discussions)
- **Email**: support@sourceiq.dev

---

**Built with ❤️ by the SourceIQ Team**