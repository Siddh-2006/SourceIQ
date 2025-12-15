# SourceIQ Troubleshooting Guide

## Common Issues & Solutions

### 🔥 **API Rate Limiting Issues**

#### Problem: "You exceeded your current quota" Error
```
❌ API Key 1 failed: [GoogleGenerativeAI Error]: You exceeded your current quota, 
please check your plan and billing details. Quota exceeded for metric: 
generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20
```

#### Solutions:
1. **Add More API Keys**: Each free tier key allows 20 requests/day
   ```bash
   # In .env.local
   VITE_GEMINI_API_KEY=key1,key2,key3,key4,key5,key6,key7,key8,key9,key10
   ```

2. **Upgrade to Paid Plan**: Remove rate limits entirely
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Upgrade to paid tier for unlimited requests

3. **Wait for Reset**: Free tier resets every 24 hours
   - Monitor usage at [AI Dev Console](https://ai.dev/usage?tab=rate-limit)

#### Prevention:
- Use minimum 10 API keys for production
- Monitor key usage distribution
- Implement key rotation strategy

---

### 🔧 **JSON Parsing Errors**

#### Problem: "Unterminated string in JSON" Error
```
JSON parsing failed: SyntaxError: Unterminated string in JSON at position 4611
```

#### Root Causes:
1. **API Response Truncation**: Gemini response cut off mid-JSON
2. **Special Characters**: Unescaped quotes or control characters
3. **Network Issues**: Incomplete response transmission

#### Solutions:
✅ **Automatic Recovery** (Already Implemented):
- Advanced character-by-character parsing
- Fallback to partial JSON extraction
- Default module structure as last resort

#### Manual Debugging:
```typescript
// Enable detailed logging
console.log('Raw API Response:', response);
console.log('Cleaned Text:', cleanText);
console.log('Parse Attempt:', JSON.parse(cleanText));
```

---

### 🚫 **Analysis Failures**

#### Problem: "Cannot read properties of undefined (reading 'score')"
```
TypeError: Cannot read properties of undefined (reading 'score')
at analyzeRepo (geminiService.ts:1059:27)
```

#### Root Cause:
- One or more analysis modules failed to complete
- Undefined module results passed to score calculation

#### Solution:
✅ **Null Safety** (Already Implemented):
```typescript
// Safe property access with fallbacks
const allScores = [
  allResults.structure?.score || 50,
  allResults.code_quality?.score || 50,
  // ... other modules with fallbacks
].filter(score => score !== undefined && score !== null);
```

---

### 🌐 **GitHub API Issues**

#### Problem: GitHub Rate Limiting
```
GitHub API rate limit exceeded (60 requests/hour)
```

#### Solutions:
1. **Add GitHub Token**:
   ```bash
   # In .env.local
   VITE_GITHUB_TOKEN=ghp_your_personal_access_token
   ```
   - Increases limit from 60 to 5,000 requests/hour

2. **Create Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `public_repo` scope
   - Add to environment variables

#### Problem: Repository Not Found
```
GitHub repository not found or private
```

#### Solutions:
1. **Verify URL Format**:
   ```
   ✅ https://github.com/owner/repo
   ❌ https://github.com/owner/repo/tree/main
   ❌ github.com/owner/repo
   ```

2. **Check Repository Visibility**:
   - Ensure repository is public
   - Private repos require authentication

---

### 🎯 **Dashboard Display Issues**

#### Problem: Mission Control Layout Broken
- Risk section too small
- Team topology not vertical
- Text formatting missing

#### Solution:
✅ **Enhanced Layout** (Already Implemented):
- 3-column responsive grid
- Expanded risk assessment section
- Vertical team topology cards
- Smart keyword highlighting

#### Problem: Text Not Formatted
- No bold keywords
- Raw text display
- Missing emphasis

#### Solution:
✅ **Smart Text Processing** (Already Implemented):
```typescript
// Automatic keyword highlighting
{text.split(/(\b(?:security|performance|critical|urgent)\b)/gi).map((part, index) => {
  const isKeyword = /^(security|performance|critical|urgent)$/i.test(part);
  return isKeyword ? (
    <span key={index} className="font-semibold text-white">{part}</span>
  ) : (
    <span key={index}>{part}</span>
  );
})}
```

---

### 🔐 **Environment Configuration**

#### Problem: API Keys Not Loading
```
No valid Gemini API keys found
```

#### Solutions:
1. **Check Environment File**:
   ```bash
   # Verify .env.local exists and contains:
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

2. **Restart Development Server**:
   ```bash
   npm run dev
   ```

3. **Verify Key Format**:
   ```bash
   # Multiple keys (comma-separated)
   VITE_GEMINI_API_KEY=key1,key2,key3
   
   # Single key
   VITE_GEMINI_API_KEY=AIzaSyC...
   ```

#### Problem: Keys Not Working in Production
```
API keys work locally but fail in production
```

#### Solutions:
1. **Vercel Environment Variables**:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add `VITE_GEMINI_API_KEY` with your keys
   - Redeploy the application

2. **Check Build Process**:
   ```bash
   npm run build
   npm run preview
   ```

---

### 🚀 **Performance Issues**

#### Problem: Slow Analysis (>2 minutes)
```
Analysis taking too long to complete
```

#### Solutions:
1. **Increase API Keys**: More keys = faster parallel processing
2. **Check Network**: Verify stable internet connection
3. **Monitor Console**: Look for failed requests

#### Problem: High Memory Usage
```
Browser tab consuming excessive memory
```

#### Solutions:
1. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R)
2. **Close Other Tabs**: Free up browser memory
3. **Restart Browser**: Reset memory allocation

---

### 🔍 **Debugging Tools**

#### Enable Detailed Logging
```typescript
// In geminiService.ts
console.log('🔥 Launching parallel API calls...');
console.log('📊 Key Distribution:', keyDistribution);
console.log('✅ Success with API Key', keyIndex);
console.log('❌ API Key failed:', error.message);
```

#### Monitor API Usage
```typescript
// Track API key performance
const keyStats = {
  successful: 0,
  failed: 0,
  rateLimited: 0,
  averageResponseTime: 0
};
```

#### Browser Developer Tools
1. **Network Tab**: Monitor API requests
2. **Console Tab**: View error messages
3. **Application Tab**: Check localStorage/sessionStorage

---

### 📊 **Production Monitoring**

#### Key Metrics to Monitor
- **Analysis Success Rate**: Should be >95%
- **Average Analysis Time**: Should be <60 seconds
- **API Key Distribution**: Even usage across keys
- **Error Rate**: Should be <5%

#### Alerting Setup
```typescript
// Monitor critical failures
if (successRate < 0.95) {
  alert('Analysis success rate below threshold');
}

if (averageTime > 60000) {
  alert('Analysis time exceeding 60 seconds');
}
```

---

### 🆘 **Emergency Recovery**

#### Complete System Failure
1. **Check Service Status**:
   - GitHub API: [status.github.com](https://status.github.com)
   - Google AI: [status.cloud.google.com](https://status.cloud.google.com)

2. **Fallback Strategies**:
   - Use cached results if available
   - Reduce analysis scope
   - Switch to backup API keys

3. **User Communication**:
   ```typescript
   // Show user-friendly error message
   setError('Analysis temporarily unavailable. Please try again in a few minutes.');
   ```

#### Data Recovery
```typescript
// Attempt to recover partial results
const partialResults = localStorage.getItem('partial_analysis');
if (partialResults) {
  const recovered = JSON.parse(partialResults);
  // Continue from where we left off
}
```

---

### 📞 **Getting Help**

#### Before Reporting Issues
1. **Check Console**: Look for error messages
2. **Verify Configuration**: Ensure API keys are correct
3. **Test with Different Repository**: Rule out repo-specific issues
4. **Clear Cache**: Hard refresh browser

#### Issue Reporting Template
```markdown
**Environment:**
- Browser: Chrome/Firefox/Safari
- Version: 
- OS: Windows/Mac/Linux

**Configuration:**
- Number of API keys: 
- GitHub token configured: Yes/No
- Repository URL: 

**Error Message:**
```
[Paste exact error message here]
```

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**

**Actual Behavior:**
```

#### Support Channels
- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Check docs/ folder for detailed guides
- **Community**: Stack Overflow with `sourceiq` tag

---

This troubleshooting guide covers the most common issues and their solutions. The system is designed to be resilient with automatic error recovery, but these manual steps can help resolve edge cases.