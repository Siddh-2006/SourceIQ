# SourceIQ API Documentation

## Overview

SourceIQ provides a comprehensive API for repository analysis through its service layer. The API integrates with GitHub and Google Gemini to deliver detailed technical assessments with enterprise-grade reliability and error handling.

## Recent Improvements (v2.1)

### 🔧 **Enhanced Error Handling & Recovery**
- **JSON Parsing Resilience**: Advanced fallback parsing for malformed API responses
- **Null Safety**: Comprehensive null checks preventing undefined property access
- **Graceful Degradation**: Default module structures when analysis fails
- **Smart Recovery**: Automatic retry with cleaned data on parsing failures

### 🚀 **Performance & Reliability**
- **10-Key Parallel Processing**: Intelligent distribution across multiple API keys
- **Rate Limit Management**: Automatic key rotation with failure tracking
- **Fallback Mechanisms**: Robust error recovery with minimal user impact
- **Production Logging**: Clean, production-ready error handling

### 🎯 **Mission Control Dashboard**
- **Enhanced Layout**: 3-column responsive design with proper space allocation
- **Smart Text Formatting**: Automatic keyword highlighting for better readability
- **Risk Assessment**: Expanded risk section with priority-based organization
- **Team Topology**: Vertical layout with hiring priority indicators

## Core Services

### GitHub Service

#### `getRepositoryData(owner: string, repo: string)`

Fetches comprehensive repository data from GitHub API.

**Parameters:**
- `owner` (string): Repository owner username
- `repo` (string): Repository name

**Returns:** `Promise<GitHubRepoAnalysis>`

**Example:**
```typescript
const githubService = new GitHubService();
const data = await githubService.getRepositoryData('facebook', 'react');
```

**Response Structure:**
```typescript
interface GitHubRepoAnalysis {
  repo: GitHubRepoData;           // Basic repository info
  languages: Record<string, number>; // Language statistics
  files: GitHubFileContent[];     // Repository file structure
  commits: GitHubCommitData[];    // Recent commit history
  contributors: any[];            // Contributor information
  readme: string | null;          // README content
  packageJson: any | null;        // package.json content
  hasTests: boolean;              // Test detection
  hasCI: boolean;                 // CI/CD detection
  hasDockerfile: boolean;         // Docker detection
  branches: any[];                // Branch information
}
```

#### `parseRepoUrl(url: string)`

Parses GitHub repository URL to extract owner and repo name.

**Parameters:**
- `url` (string): GitHub repository URL

**Returns:** `{ owner: string; repo: string } | null`

**Example:**
```typescript
const parsed = githubService.parseRepoUrl('https://github.com/facebook/react');
// Returns: { owner: 'facebook', repo: 'react' }
```

### Analysis Service

#### `analyzeRepo(repoUrl: string)`

Performs comprehensive repository analysis using AI and GitHub data.

**Parameters:**
- `repoUrl` (string): Full GitHub repository URL

**Returns:** `Promise<FullReport>`

**Example:**
```typescript
import { analyzeRepo } from './services/geminiService';

const report = await analyzeRepo('https://github.com/facebook/react');
```

**Analysis Process:**
1. Parse GitHub URL
2. Fetch repository data via GitHub API
3. Generate 11 specialized analysis prompts
4. Execute parallel AI analysis across multiple API keys
5. Aggregate results into comprehensive report

#### `chatWithRepo(messages: ChatMessage[], repoUrl: string)`

Enables follow-up questions about analyzed repository.

**Parameters:**
- `messages` (ChatMessage[]): Conversation history
- `repoUrl` (string): Repository URL for context

**Returns:** `Promise<string>`

**Example:**
```typescript
const response = await chatWithRepo([
  { role: 'user', text: 'What are the main security concerns?' }
], 'https://github.com/facebook/react');
```

## Data Models

### FullReport Interface

```typescript
interface FullReport {
  repo_metadata: RepoMetadata;
  critical_flags: CriticalFlags;
  home_page: HomePageData;
  modules: ModuleMap;
  improvement_roadmap: ImprovementItem[];
  repo_url?: string;
}
```

### RepoMetadata

```typescript
interface RepoMetadata {
  name: string;                 // Repository name
  language_stack: string[];     // Programming languages used
  age_months: number;           // Repository age in months
  stars: number;                // GitHub stars count
  forks: number;                // GitHub forks count
}
```

### CriticalFlags

```typescript
interface CriticalFlags {
  has_tests: boolean;           // Test files detected
  has_readme: boolean;          // README file exists
  has_license: boolean;         // License file exists
  secrets_detected: boolean;    // Potential secrets found
  unused_dependencies: number;  // Count of unused dependencies
}
```

### ModuleAnalysis

```typescript
interface ModuleAnalysis {
  score: number;                // 0-100 quality score
  medal: MedalType;            // Gold/Silver/Bronze
  strengths: string[];         // Identified strengths
  weaknesses: string[];        // Areas for improvement
  hidden_risks: string[];      // Potential future issues
  real_world_impact: string;   // Business impact description
  failure_scenario: string;    // What could go wrong
  remediation_steps: string[]; // Actionable improvements
}
```

## Analysis Modules

### 1. Structural Integrity
- **Focus**: Architecture, organization, modularity
- **Data Sources**: File structure, import patterns, build configs
- **Key Metrics**: Coupling, cohesion, complexity

### 2. Code Quality & Maintainability
- **Focus**: Code standards, patterns, technical debt
- **Data Sources**: Source code analysis, formatting, comments
- **Key Metrics**: Readability, maintainability, consistency

### 3. Documentation & Knowledge Transfer
- **Focus**: Documentation quality, knowledge sharing
- **Data Sources**: README, code comments, wikis
- **Key Metrics**: Completeness, clarity, accessibility

### 4. Testing & Reliability
- **Focus**: Test coverage, quality assurance
- **Data Sources**: Test files, CI/CD configs, coverage reports
- **Key Metrics**: Coverage, test quality, automation

### 5. Version Control Discipline
- **Focus**: Git practices, collaboration workflows
- **Data Sources**: Commit history, branch structure, PRs
- **Key Metrics**: Commit quality, branching strategy, collaboration

### 6. Security & Vulnerability Assessment
- **Focus**: Security practices, vulnerability detection
- **Data Sources**: Dependencies, authentication, authorization
- **Key Metrics**: Vulnerability count, security practices, compliance

### 7. Performance & Scalability
- **Focus**: Performance optimization, scalability patterns
- **Data Sources**: Bundle analysis, architecture patterns
- **Key Metrics**: Performance scores, scalability indicators

### 8. Dependency Management
- **Focus**: Package health, supply chain security
- **Data Sources**: package.json, dependency tree, security advisories
- **Key Metrics**: Dependency health, update frequency, security

### 9. Deployment & DevOps Maturity
- **Focus**: CI/CD, infrastructure, monitoring
- **Data Sources**: CI configs, deployment scripts, monitoring setup
- **Key Metrics**: Automation level, deployment frequency, reliability

### 10. Business Alignment & Product Strategy
- **Focus**: Business value, product-market fit
- **Data Sources**: Project structure, feature organization
- **Key Metrics**: Business alignment, growth potential, market fit

## API Rate Limiting & Management

### GitHub API Limits

```typescript
// Without authentication
const GITHUB_RATE_LIMIT = 60; // requests per hour

// With personal access token
const GITHUB_AUTHENTICATED_LIMIT = 5000; // requests per hour
```

### Gemini API Management

```typescript
class APIKeyManager {
  private apiKeys: string[];
  private currentKeyIndex: number = 0;
  private failedKeys: Set<number> = new Set();
  
  // Intelligent key rotation
  getNextKey(): string | null {
    // Skip failed keys
    // Reset failed keys after 1 hour
    // Round-robin distribution
  }
}
```

### Parallel Processing Strategy

```typescript
// Distribute 11 prompts across N API keys
const keyDistribution = prompts.map((prompt, index) => ({
  prompt,
  keyIndex: index % apiKeys.length,
  retryCount: 0
}));

// Execute with fallback
const results = await Promise.allSettled(
  keyDistribution.map(({ prompt, keyIndex }) => 
    callGeminiWithSpecificKey(prompt, keyIndex)
  )
);
```

## Error Handling Strategy

### Error Classification

```typescript
enum ErrorType {
  RATE_LIMIT = 'rate_limit',      // 429 errors
  INVALID_KEY = 'invalid_key',    // 403 errors
  SERVICE_OVERLOAD = 'overload',  // 503 errors
  NETWORK_ERROR = 'network',      // Fetch failures
  PARSING_ERROR = 'parsing',      // JSON parsing issues
  VALIDATION_ERROR = 'validation' // Input validation
}
```

### Advanced JSON Parsing Recovery

```typescript
function parseGeminiResponse(text: string): any {
  try {
    // Standard parsing attempt
    return JSON.parse(cleanText);
  } catch (error) {
    // Advanced recovery: Character-by-character parsing
    try {
      let validJson = '';
      let braceCount = 0;
      let inString = false;
      let escapeNext = false;
      
      for (const char of fallbackText) {
        if (escapeNext) {
          validJson += char;
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          validJson += char;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
        }
        
        if (!inString) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }
        
        validJson += char;
        
        // Try parsing when we have a complete object
        if (braceCount === 0 && validJson.trim().endsWith('}')) {
          try {
            return JSON.parse(validJson);
          } catch (e) {
            // Continue building
          }
        }
      }
      
      // Ultimate fallback: Return default structure
      return getDefaultModule(moduleType);
    } catch (fallbackError) {
      throw new Error(`Failed to parse API response: ${error.message}`);
    }
  }
}
```

### Null Safety Implementation

```typescript
// Safe score calculation with fallbacks
const allScores = [
  allResults.structure?.score || 50,
  allResults.code_quality?.score || 50,
  allResults.documentation?.score || 50,
  allResults.testing?.score || 50,
  allResults.version_control?.score || 50,
  allResults.security?.score || 50,
  allResults.performance?.score || 50,
  allResults.dependencies?.score || 50,
  allResults.deployment?.score || 50,
  allResults.business_alignment?.score || 50
].filter(score => score !== undefined && score !== null);

const overallScore = allScores.length > 0 
  ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
  : 50;
```

### Default Module Structure

```typescript
function getDefaultModule(moduleType: string) {
  return {
    score: 50,
    medal: 'Bronze' as const,
    strengths: [`${moduleType} analysis was incomplete`],
    weaknesses: ['Analysis interrupted due to technical issues'],
    hidden_risks: ['Unable to complete full analysis'],
    real_world_impact: `${moduleType} analysis needs to be retried for complete assessment.`,
    failure_scenario: 'Technical analysis failure - please retry the analysis.',
    remediation_steps: ['Retry the analysis', 'Check API response format', 'Verify repository access']
  };
}
```

### Recovery Strategies

```typescript
const recoveryStrategies = {
  [ErrorType.RATE_LIMIT]: () => tryNextApiKey(),
  [ErrorType.INVALID_KEY]: () => skipKey(),
  [ErrorType.SERVICE_OVERLOAD]: () => waitAndRetry(3000),
  [ErrorType.NETWORK_ERROR]: () => retryWithBackoff(),
  [ErrorType.PARSING_ERROR]: () => cleanAndRetryParsing(),
  [ErrorType.VALIDATION_ERROR]: () => throwUserError()
};
```

## Configuration Management

### Environment Variables

```typescript
interface EnvironmentConfig {
  // Required
  GEMINI_API_KEY: string;        // Comma-separated API keys
  
  // Optional
  GITHUB_TOKEN?: string;         // GitHub personal access token
  NODE_ENV: 'development' | 'production';
  
  // Vite-specific (client-side)
  VITE_GEMINI_API_KEY?: string;  // Client-side API keys
  VITE_GITHUB_TOKEN?: string;    // Client-side GitHub token
}
```

### Configuration Validation

```typescript
const validateConfig = (): void => {
  const apiKeys = getApiKeys();
  
  if (apiKeys.length === 0) {
    throw new Error('No valid Gemini API keys found');
  }
  
  if (apiKeys.length < 3) {
    console.warn('Less than 3 API keys may cause rate limiting');
  }
};
```

## Testing Strategy

### Unit Testing

```typescript
// Service testing
describe('GitHubService', () => {
  it('should parse repository URL correctly', () => {
    const result = githubService.parseRepoUrl('https://github.com/owner/repo');
    expect(result).toEqual({ owner: 'owner', repo: 'repo' });
  });
});
```

### Integration Testing

```typescript
// API integration testing
describe('Repository Analysis', () => {
  it('should analyze public repository', async () => {
    const report = await analyzeRepo('https://github.com/facebook/react');
    expect(report.repo_metadata.name).toBe('react');
    expect(report.modules.structure.score).toBeGreaterThan(0);
  });
});
```

### End-to-End Testing

```typescript
// E2E testing with Playwright
test('complete analysis workflow', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder*="github.com"]', 'https://github.com/facebook/react');
  await page.click('button:has-text("Analyze")');
  await expect(page.locator('.dashboard')).toBeVisible();
});
```

## Performance Benchmarks

### Target Metrics

- **Analysis Time**: < 60 seconds for complete analysis
- **API Success Rate**: > 95% successful analyses
- **Error Recovery**: < 5 seconds for fallback activation
- **Bundle Size**: < 1MB gzipped
- **First Contentful Paint**: < 2 seconds
- **Time to Interactive**: < 3 seconds

### Optimization Techniques

1. **Code Splitting**: Lazy load dashboard components
2. **Tree Shaking**: Remove unused dependencies
3. **Image Optimization**: Compress and optimize assets
4. **Caching**: Aggressive caching of static assets
5. **Parallel Processing**: Concurrent API requests

## Security Best Practices

### API Security

```typescript
// Secure API key handling
const sanitizeApiKey = (key: string): string => {
  return key.replace(/[^a-zA-Z0-9-_]/g, '');
};

// Rate limiting
const rateLimiter = new Map<string, number>();
const checkRateLimit = (ip: string): boolean => {
  const requests = rateLimiter.get(ip) || 0;
  return requests < MAX_REQUESTS_PER_HOUR;
};
```

### Input Sanitization

```typescript
// URL validation
const isValidGitHubUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'github.com' && 
           parsed.pathname.split('/').length >= 3;
  } catch {
    return false;
  }
};
```

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://api.github.com https://generativelanguage.googleapis.com;">
```

This architecture documentation provides a comprehensive overview of how SourceIQ is built, following enterprise-grade practices for scalability, security, and maintainability.