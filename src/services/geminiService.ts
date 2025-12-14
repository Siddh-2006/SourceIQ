import { GoogleGenerativeAI } from "@google/generative-ai";
import { FullReport, ChatMessage } from "../types";

// API Key Management with Fallbacks
class APIKeyManager {
  private apiKeys: string[];
  private currentKeyIndex: number = 0;
  private failedKeys: Set<number> = new Set();
  private lastResetTime: number = Date.now();

  constructor() {
    // Get API key from environment variables
    const apiKeyString = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';



    this.apiKeys = apiKeyString
      .split(',')
      .map(key => key.trim())
      .filter(key => key.length > 0);

    if (this.apiKeys.length === 0) {
      console.error('❌ No valid Gemini API keys found in environment variables');
      // Don't throw error in production, use fallback
      this.apiKeys = ['fallback-key'];
    }


  }

  getCurrentKey(): string {
    return this.apiKeys[this.currentKeyIndex];
  }

  markCurrentKeyAsFailed(): void {
    this.failedKeys.add(this.currentKeyIndex);
  }

  getNextKey(): string | null {
    // Reset failed keys if it's been more than 1 hour
    if (Date.now() - this.lastResetTime > 3600000) {
      this.resetFailedKeys();
    }

    // Try to find next working key
    for (let i = 0; i < this.apiKeys.length; i++) {
      const nextIndex = (this.currentKeyIndex + 1 + i) % this.apiKeys.length;
      if (!this.failedKeys.has(nextIndex)) {
        this.currentKeyIndex = nextIndex;
        return this.apiKeys[this.currentKeyIndex];
      }
    }

    // If all keys failed, reset and try again
    this.resetFailedKeys();
    this.currentKeyIndex = 0;
    return this.apiKeys[this.currentKeyIndex];
  }

  resetFailedKeys(): void {
    this.failedKeys.clear();
    this.lastResetTime = Date.now();
  }

  getStats(): { total: number; failed: number; current: number; available: number } {
    return {
      total: this.apiKeys.length,
      failed: this.failedKeys.size,
      current: this.currentKeyIndex + 1,
      available: this.apiKeys.length - this.failedKeys.size
    };
  }
}

const apiKeyManager = new APIKeyManager();

// Enhanced Gemini Service with Retry Logic
async function callGeminiWithFallback(prompt: string, maxRetries: number = 3): Promise<string> {
  let lastError: Error | null = null;
  const workingModel = "models/gemini-2.5-flash";



  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const currentKey = apiKeyManager.getCurrentKey();


      const genAI = new GoogleGenerativeAI(currentKey);
      const model = genAI.getGenerativeModel({
        model: workingModel,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
        }
      });


      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini");
      }


      return text;

    } catch (error) {
      lastError = error as Error;


      // Check if it's a quota/auth error (should try next key)
      if (lastError.message.includes('quota') ||
        lastError.message.includes('API key') ||
        lastError.message.includes('403') ||
        lastError.message.includes('429')) {

        console.log('🔄 Quota/Auth error, switching to next API key...');
        apiKeyManager.markCurrentKeyAsFailed();
        const nextKey = apiKeyManager.getNextKey();

        if (!nextKey && attempt === maxRetries - 1) {
          throw new Error(`All ${apiKeyManager.getStats().total} API keys exhausted. Last error: ${lastError.message}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }

      // For other errors, retry with same key
      if (attempt < maxRetries - 1) {
        console.log(`🔄 Retrying in ${2 * (attempt + 1)} seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
        continue;
      }
    }
  }

  throw lastError || new Error('Unknown error occurred');
}

const SYSTEM_INSTRUCTION = `
You are an AI system acting as a Principal Software Engineer, Security Architect, CTO-level Reviewer, and Product & Business Intelligence Analyst at a top-tier technology organization.

CRITICAL: You MUST analyze the SPECIFIC repository provided. Do NOT use generic or template responses. Every field must be customized based on the actual repository content, structure, and characteristics.

Analyze the given GitHub repository and provide a comprehensive quality assessment in JSON format with the following structure:

{
  "repo_metadata": {
    "name": "repository name",
    "language_stack": ["JavaScript", "TypeScript"],
    "age_months": 24,
    "stars": 1000,
    "forks": 200
  },
  "critical_flags": {
    "has_tests": true,
    "has_readme": true,
    "has_license": true,
    "secrets_detected": false,
    "unused_dependencies": 2
  },
  "home_page": {
    "overview": "Brief overview of the repository",
    "executive_summary": "Executive summary for stakeholders",
    "overall_score": 85,
    "maturity_level": "Advanced",
    "risk_snapshot": ["Risk 1", "Risk 2"],
    "team_recommendation": [
      {"role": "Senior Developer", "count": 2, "justification": "Reason"}
    ]
  },
  "modules": {
    "structure": {"score": 85, "medal": "Gold", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": []},
    "code_quality": {"score": 80, "medal": "Gold", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": []},
    "documentation": {"score": 90, "medal": "Platinum", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": []},
    "testing": {"score": 75, "medal": "Gold", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": []},
    "version_control": {"score": 85, "medal": "Gold", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": []},
    "security": {"score": 80, "medal": "Gold", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": [], "vulnerabilities": [{"issue": "Example vulnerability", "severity": 5, "explanation": "Detailed explanation", "mitigation": "How to fix it"}]},
    "operational": {"score": 70, "medal": "Silver", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": []},
    "professionalism": {"score": 85, "medal": "Gold", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": []},
    "business": {"score": 75, "medal": "Gold", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": []},
    "scalability": {"score": 70, "medal": "Silver", "strengths": [], "weaknesses": [], "hidden_risks": [], "real_world_impact": "", "failure_scenario": "", "remediation_steps": []}
  },
  "improvement_roadmap": [
    {"dimension": "Testing", "action": "Add more tests", "reason": "Improve reliability"}
  ]
}

Medal Logic: 90-100: Platinum, 75-89: Gold, 50-74: Silver, <50: Bronze

CRITICAL REQUIREMENTS:
1. ANALYZE THE ACTUAL REPOSITORY: Visit the GitHub URL and examine the real code, structure, files, and documentation
2. CUSTOMIZE ALL CONTENT: Every field must reflect the specific repository - no generic responses
3. REPOSITORY-SPECIFIC DETAILS: Include actual file names, technologies used, project structure findings
4. REAL VULNERABILITIES: Identify actual security issues based on the code and dependencies you find
5. SPECIFIC RECOMMENDATIONS: Provide actionable advice based on what you actually observe

For the security module, you MUST include a "vulnerabilities" array with realistic security issues found in the actual repository. Each vulnerability should have:
- issue: Clear description of the ACTUAL security problem found
- severity: Number 1-10 based on real impact
- explanation: Technical details of why THIS SPECIFIC issue is a problem
- mitigation: Specific steps to fix THIS PARTICULAR issue

NEVER use placeholder or generic content. Every response must be unique to the repository being analyzed.
`;

// Helper function to fetch basic repository information from GitHub API
async function fetchRepoInfo(repoUrl: string): Promise<any> {
  try {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');

    const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);

    if (response.ok) {
      const data = await response.json();
      return {
        description: data.description,
        topics: data.topics || [],
        language: data.language,
        size: data.size,
        default_branch: data.default_branch,
        created_at: data.created_at,
        updated_at: data.updated_at,
        has_issues: data.has_issues,
        has_wiki: data.has_wiki,
        has_pages: data.has_pages,
        open_issues_count: data.open_issues_count,
        license: data.license?.name || 'No license'
      };
    }
  } catch (error) {
    console.log('Could not fetch additional repo context');
  }
  return null;
}

// Smart analysis with multiple smaller requests
async function getBasicRepoInfo(repoUrl: string): Promise<any> {
  const prompt = `Analyze this GitHub repository: ${repoUrl}

Return ONLY a JSON object with basic repository information:
{
  "repo_metadata": {
    "name": "repository name",
    "language_stack": ["main languages"],
    "age_months": estimated_age,
    "stars": estimated_stars,
    "forks": estimated_forks
  },
  "critical_flags": {
    "has_tests": true/false,
    "has_readme": true/false,
    "has_license": true/false,
    "secrets_detected": false,
    "unused_dependencies": estimated_number
  }
}`;

  const text = await callGeminiWithFallback(prompt, 2);
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

async function getHomePageAnalysis(repoUrl: string): Promise<any> {
  const prompt = `Analyze this GitHub repository: ${repoUrl}

Return ONLY a JSON object with executive summary:
{
  "home_page": {
    "overview": "Brief overview of the repository",
    "executive_summary": "Executive summary for stakeholders",
    "overall_score": score_0_to_100,
    "maturity_level": "Beginner|Intermediate|Advanced",
    "risk_snapshot": ["risk1", "risk2", "risk3"],
    "team_recommendation": [
      {"role": "Senior Developer", "count": 2, "justification": "reason"}
    ]
  }
}`;

  const text = await callGeminiWithFallback(prompt, 2);
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

async function getModuleAnalysis(repoUrl: string): Promise<any> {
  const prompt = `Analyze this GitHub repository: ${repoUrl}

Return ONLY a JSON object with module scores (keep arrays short, max 3 items each):
{
  "modules": {
    "structure": {"score": 85, "medal": "Gold", "strengths": ["item1"], "weaknesses": ["item1"], "hidden_risks": ["item1"], "real_world_impact": "brief", "failure_scenario": "brief", "remediation_steps": ["step1"]},
    "code_quality": {"score": 80, "medal": "Gold", "strengths": ["item1"], "weaknesses": ["item1"], "hidden_risks": ["item1"], "real_world_impact": "brief", "failure_scenario": "brief", "remediation_steps": ["step1"]},
    "documentation": {"score": 90, "medal": "Platinum", "strengths": ["item1"], "weaknesses": ["item1"], "hidden_risks": ["item1"], "real_world_impact": "brief", "failure_scenario": "brief", "remediation_steps": ["step1"]},
    "testing": {"score": 75, "medal": "Gold", "strengths": ["item1"], "weaknesses": ["item1"], "hidden_risks": ["item1"], "real_world_impact": "brief", "failure_scenario": "brief", "remediation_steps": ["step1"]},
    "version_control": {"score": 85, "medal": "Gold", "strengths": ["item1"], "weaknesses": ["item1"], "hidden_risks": ["item1"], "real_world_impact": "brief", "failure_scenario": "brief", "remediation_steps": ["step1"]}
  }
}`;

  const text = await callGeminiWithFallback(prompt, 2);
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

async function getSecurityAnalysis(repoUrl: string): Promise<any> {
  const prompt = `Analyze this GitHub repository for security: ${repoUrl}

Return ONLY a JSON object with security analysis (max 4 vulnerabilities):
{
  "security": {
    "score": 80, 
    "medal": "Gold", 
    "strengths": ["strength1", "strength2"], 
    "weaknesses": ["weakness1", "weakness2"], 
    "hidden_risks": ["risk1", "risk2"], 
    "real_world_impact": "brief impact", 
    "failure_scenario": "brief scenario", 
    "remediation_steps": ["step1", "step2"], 
    "vulnerabilities": [
      {"issue": "vulnerability name", "severity": 5, "explanation": "brief explanation", "mitigation": "how to fix"}
    ]
  }
}`;

  const text = await callGeminiWithFallback(prompt, 2);
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

async function getRemainingModules(repoUrl: string): Promise<any> {
  const prompt = `Analyze this GitHub repository: ${repoUrl}

Return ONLY a JSON object with remaining modules (keep brief):
{
  "operational": {"score": 70, "medal": "Silver", "strengths": ["item1"], "weaknesses": ["item1"], "hidden_risks": ["item1"], "real_world_impact": "brief", "failure_scenario": "brief", "remediation_steps": ["step1"]},
  "professionalism": {"score": 85, "medal": "Gold", "strengths": ["item1"], "weaknesses": ["item1"], "hidden_risks": ["item1"], "real_world_impact": "brief", "failure_scenario": "brief", "remediation_steps": ["step1"]},
  "business": {"score": 75, "medal": "Gold", "strengths": ["item1"], "weaknesses": ["item1"], "hidden_risks": ["item1"], "real_world_impact": "brief", "failure_scenario": "brief", "remediation_steps": ["step1"]},
  "scalability": {"score": 70, "medal": "Silver", "strengths": ["item1"], "weaknesses": ["item1"], "hidden_risks": ["item1"], "real_world_impact": "brief", "failure_scenario": "brief", "remediation_steps": ["step1"]},
  "improvement_roadmap": [
    {"dimension": "Testing", "action": "Add tests", "reason": "Improve reliability"}
  ]
}`;

  const text = await callGeminiWithFallback(prompt, 2);
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export const analyzeRepo = async (repoUrl: string): Promise<FullReport> => {
  console.log('🔍 Starting smart analysis for:', repoUrl);
  console.log('🔑 API Keys available:', apiKeyManager.getStats().total);

  try {
    console.log('📤 Getting basic repo info...');
    const basicInfo = await getBasicRepoInfo(repoUrl);

    console.log('📤 Getting home page analysis...');
    const homePageInfo = await getHomePageAnalysis(repoUrl);

    console.log('📤 Getting module analysis...');
    const moduleInfo = await getModuleAnalysis(repoUrl);

    console.log('📤 Getting security analysis...');
    const securityInfo = await getSecurityAnalysis(repoUrl);

    console.log('📤 Getting remaining modules...');
    const remainingInfo = await getRemainingModules(repoUrl);

    // Combine all results
    const result: FullReport = {
      repo_url: repoUrl,
      repo_metadata: basicInfo.repo_metadata,
      critical_flags: basicInfo.critical_flags,
      home_page: homePageInfo.home_page,
      modules: {
        ...moduleInfo.modules,
        security: securityInfo.security,
        operational: remainingInfo.operational,
        professionalism: remainingInfo.professionalism,
        business: remainingInfo.business,
        scalability: remainingInfo.scalability
      },
      improvement_roadmap: remainingInfo.improvement_roadmap
    };

    console.log('🎉 Smart analysis completed successfully!');
    return result;

  } catch (error) {
    console.error('❌ Smart analysis failed:', error);
    return createFallbackResponse(repoUrl);
  }
};

function createFallbackResponse(repoUrl: string): FullReport {
  const repoName = repoUrl.split('/').pop() || 'Unknown Repository';

  return {
    repo_url: repoUrl,
    repo_metadata: {
      name: repoName,
      language_stack: ['JavaScript', 'TypeScript'],
      age_months: 12,
      stars: 100,
      forks: 20
    },
    critical_flags: {
      has_tests: true,
      has_readme: true,
      has_license: true,
      secrets_detected: false,
      unused_dependencies: 1
    },
    home_page: {
      overview: `⚠️ FALLBACK MODE: Analysis for ${repoName} - API connection failed, showing sample data.`,
      executive_summary: '⚠️ FALLBACK MODE: This is sample data because the AI analysis failed. Please check your API keys and try again.',
      overall_score: 75,
      maturity_level: 'Intermediate' as const,
      risk_snapshot: ['⚠️ API connection failed - showing sample data', 'Check API keys and retry analysis'],
      team_recommendation: [
        { role: 'Senior Developer', count: 1, justification: 'Standard maintenance requirements' },
        { role: 'DevOps Engineer', count: 1, justification: 'Deployment and monitoring' }
      ]
    },
    modules: {
      structure: { score: 75, medal: 'Gold' as const, strengths: ['Standard structure'], weaknesses: ['Needs detailed review'], hidden_risks: [], real_world_impact: 'Moderate maintainability', failure_scenario: 'Standard risks', remediation_steps: ['Code review'] },
      code_quality: { score: 70, medal: 'Silver' as const, strengths: ['Readable code'], weaknesses: ['Needs analysis'], hidden_risks: [], real_world_impact: 'Good baseline', failure_scenario: 'Standard risks', remediation_steps: ['Quality review'] },
      documentation: { score: 80, medal: 'Gold' as const, strengths: ['Has README'], weaknesses: ['Needs more docs'], hidden_risks: [], real_world_impact: 'Good documentation', failure_scenario: 'Low risk', remediation_steps: ['Expand docs'] },
      testing: { score: 65, medal: 'Silver' as const, strengths: ['Has tests'], weaknesses: ['Coverage unknown'], hidden_risks: [], real_world_impact: 'Basic testing', failure_scenario: 'Medium risk', remediation_steps: ['Improve tests'] },
      version_control: { score: 80, medal: 'Gold' as const, strengths: ['Git practices'], weaknesses: [], hidden_risks: [], real_world_impact: 'Good practices', failure_scenario: 'Low risk', remediation_steps: [] },
      security: {
        score: 70,
        medal: 'Silver' as const,
        strengths: ['Basic security practices', 'No exposed secrets detected'],
        weaknesses: ['Missing security headers', 'Outdated dependencies'],
        hidden_risks: ['Potential XSS vulnerabilities', 'Insufficient input validation'],
        real_world_impact: 'Moderate security posture with room for improvement',
        failure_scenario: 'Potential data breaches or service disruption',
        remediation_steps: ['Implement security headers', 'Update dependencies', 'Add input validation'],
        vulnerabilities: [
          {
            issue: 'Missing Content Security Policy (CSP)',
            severity: 6,
            explanation: 'The application lacks proper CSP headers, making it vulnerable to XSS attacks and code injection.',
            mitigation: 'Implement strict CSP headers in your web server configuration or application middleware.'
          },
          {
            issue: 'Outdated Dependencies Detected',
            severity: 7,
            explanation: 'Several npm packages are using outdated versions with known security vulnerabilities.',
            mitigation: 'Run npm audit and update dependencies to their latest secure versions.'
          },
          {
            issue: 'Insufficient Input Validation',
            severity: 5,
            explanation: 'User inputs are not properly sanitized, potentially allowing injection attacks.',
            mitigation: 'Implement comprehensive input validation and sanitization for all user-facing endpoints.'
          },
          {
            issue: 'Missing Rate Limiting',
            severity: 4,
            explanation: 'API endpoints lack rate limiting, making them vulnerable to abuse and DoS attacks.',
            mitigation: 'Implement rate limiting middleware to prevent API abuse and ensure service availability.'
          }
        ]
      },
      operational: { score: 65, medal: 'Silver' as const, strengths: ['Basic ops'], weaknesses: ['Needs monitoring'], hidden_risks: [], real_world_impact: 'Basic operations', failure_scenario: 'Medium risk', remediation_steps: ['Add monitoring'] },
      professionalism: { score: 75, medal: 'Gold' as const, strengths: ['Professional setup'], weaknesses: [], hidden_risks: [], real_world_impact: 'Good practices', failure_scenario: 'Low risk', remediation_steps: [] },
      business: { score: 70, medal: 'Silver' as const, strengths: ['Business value'], weaknesses: ['Needs analysis'], hidden_risks: [], real_world_impact: 'Standard value', failure_scenario: 'Medium risk', remediation_steps: ['Business review'] },
      scalability: { score: 65, medal: 'Silver' as const, strengths: ['Basic scalability'], weaknesses: ['Needs optimization'], hidden_risks: [], real_world_impact: 'Limited scale', failure_scenario: 'High risk', remediation_steps: ['Performance review'] }
    },
    improvement_roadmap: [
      { dimension: 'API Access', action: 'Resolve API key issues', reason: 'Enable full analysis capabilities' },
      { dimension: 'Testing', action: 'Comprehensive test review', reason: 'Ensure reliability' },
      { dimension: 'Security', action: 'Security audit', reason: 'Identify vulnerabilities' }
    ]
  };
}

// Enhanced Chat functionality with comprehensive repository context
export const chatWithRepo = async (
  history: ChatMessage[],
  newUserMessage: string,
  reportContext: FullReport,
  repoUrl?: string
): Promise<string> => {

  // Fetch additional repository context if URL is provided
  let additionalContext = null;
  if (repoUrl && (newUserMessage.toLowerCase().includes('repo') ||
    newUserMessage.toLowerCase().includes('project') ||
    newUserMessage.toLowerCase().includes('codebase'))) {
    additionalContext = await fetchRepoInfo(repoUrl);
  }

  // Create comprehensive context from the analysis report
  const repoContext = {
    repository: {
      name: reportContext.repo_metadata.name,
      languages: reportContext.repo_metadata.language_stack,
      maturity: reportContext.home_page.maturity_level,
      overall_score: reportContext.home_page.overall_score,
      age_months: reportContext.repo_metadata.age_months
    },
    analysis_summary: reportContext.home_page.executive_summary,
    critical_risks: reportContext.home_page.risk_snapshot,
    team_needs: reportContext.home_page.team_recommendation,
    module_scores: {
      structure: reportContext.modules.structure.score,
      code_quality: reportContext.modules.code_quality.score,
      documentation: reportContext.modules.documentation.score,
      testing: reportContext.modules.testing.score,
      security: reportContext.modules.security.score,
      operational: reportContext.modules.operational.score,
      scalability: reportContext.modules.scalability.score
    },
    key_strengths: {
      structure: reportContext.modules.structure.strengths,
      code_quality: reportContext.modules.code_quality.strengths,
      security: reportContext.modules.security.strengths,
      testing: reportContext.modules.testing.strengths
    },
    major_weaknesses: {
      structure: reportContext.modules.structure.weaknesses,
      code_quality: reportContext.modules.code_quality.weaknesses,
      security: reportContext.modules.security.weaknesses,
      testing: reportContext.modules.testing.weaknesses
    },
    security_vulnerabilities: reportContext.modules.security.vulnerabilities || [],
    improvement_priorities: reportContext.improvement_roadmap.slice(0, 5),
    hidden_risks: [
      ...reportContext.modules.structure.hidden_risks,
      ...reportContext.modules.security.hidden_risks,
      ...reportContext.modules.scalability.hidden_risks
    ].slice(0, 8)
  };

  const enhancedPrompt = `You are an expert repository analyst and technical consultant with deep knowledge of software engineering best practices.

REPOSITORY CONTEXT:
You have just completed a comprehensive analysis of the repository "${reportContext.repo_metadata.name}". Here's the complete analysis data:

${JSON.stringify(repoContext, null, 2)}

${additionalContext ? `
ADDITIONAL REPOSITORY INFORMATION:
${JSON.stringify(additionalContext, null, 2)}
` : ''}

CONVERSATION HISTORY:
${history.map(msg => `${msg.role}: ${msg.text}`).join('\n')}

USER QUESTION: ${newUserMessage}

INSTRUCTIONS:
1. **Be Repository-Specific**: Always reference the actual repository name, languages, and specific findings from the analysis
2. **Use Concrete Data**: Quote specific scores, vulnerabilities, strengths, and weaknesses from the analysis
3. **Provide Actionable Advice**: Give specific, implementable recommendations based on the analysis findings
4. **Reference Context**: When discussing issues, refer to the actual risks and improvement priorities identified
5. **Be Technical but Clear**: Use appropriate technical language while remaining accessible
6. **Connect the Dots**: Relate different aspects of the analysis (e.g., how security issues might impact scalability)

RESPONSE STYLE:
- Start responses with context about the specific repository when relevant
- Use bullet points for lists and recommendations
- Include specific metrics and scores when discussing performance
- Reference actual vulnerabilities and risks found in the analysis
- Suggest concrete next steps based on the improvement roadmap

Provide a comprehensive, context-aware response that demonstrates deep understanding of this specific repository's analysis.`;

  try {
    const response = await callGeminiWithFallback(enhancedPrompt, 3);
    return response;
  } catch (error) {
    return `I'm having trouble accessing the AI service right now. However, based on the analysis of ${reportContext.repo_metadata.name}, I can see it has an overall score of ${reportContext.home_page.overall_score}/100 with ${reportContext.home_page.maturity_level.toLowerCase()} maturity. The main areas for improvement include: ${reportContext.improvement_roadmap.slice(0, 3).map(item => item.action).join(', ')}. Please try your question again in a moment.`;
  }
};