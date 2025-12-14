# SourceIQ - Repository Quality Intelligence Platform

🚀 **Transform your repository into actionable intelligence with AI-powered analysis**

SourceIQ provides comprehensive repository analysis using advanced AI to evaluate code quality, security, scalability, and team requirements. Get CTO-level insights in seconds.

## ✨ Features

- **🔍 Deep Code Analysis**: Comprehensive evaluation of structure, quality, and maintainability
- **🛡️ Security Assessment**: Vulnerability detection and security best practices analysis
- **📊 Interactive Dashboard**: Beautiful visualizations with radar charts and detailed breakdowns
- **💬 AI Chat Assistant**: Context-aware chatbot that answers questions about your repository
- **🏆 Scoring System**: Medal-based scoring (Platinum, Gold, Silver, Bronze) for easy understanding
- **👥 Team Recommendations**: AI-suggested team topology based on codebase complexity
- **🗺️ Improvement Roadmap**: Prioritized action items for repository enhancement

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API keys (Google AI Studio)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Siddh-2006/SourceIQ.git
   cd SourceIQ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Gemini API keys to `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_1,your_api_key_2,your_api_key_3
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### API Keys

SourceIQ supports multiple Gemini API keys for better reliability and quota management:

- Add multiple keys separated by commas in `GEMINI_API_KEY`
- The system automatically rotates keys when quotas are hit
- Failed keys are temporarily disabled and retried after 1 hour

### Environment Variables

```bash
GEMINI_API_KEY=key1,key2,key3,key4,key5  # Multiple API keys for fallback
```

## 📦 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
   - `GEMINI_API_KEY`: Your comma-separated API keys
3. **Deploy automatically on push to main branch**

### Manual Deployment

```bash
npm run build
npm run preview
```

## 🏗️ Architecture

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard with analysis results
│   ├── ChatInterface.tsx # AI chat assistant
│   └── RadarView.tsx    # Radar chart visualization
├── services/           # API services
│   └── geminiService.ts # Gemini AI integration
├── types.ts           # TypeScript type definitions
└── App.tsx           # Main application component
```

## 🎯 Analysis Modules

SourceIQ evaluates repositories across 10 key dimensions:

1. **Structure & Organization** - Code architecture and project layout
2. **Code Quality** - Maintainability, readability, and best practices
3. **Documentation** - README, comments, and knowledge transfer
4. **Testing & Reliability** - Test coverage and quality assurance
5. **Version Control** - Git practices and collaboration workflows
6. **Security** - Vulnerability assessment and security practices
7. **Operational Readiness** - Deployment and monitoring capabilities
8. **Professionalism** - Engineering maturity and standards
9. **Business Intelligence** - Market fit and adoption signals
10. **Scalability** - Long-term growth and technical debt assessment

## 🤖 AI Chat Features

The integrated chat assistant provides:

- **Repository-specific responses** based on actual analysis data
- **Vulnerability explanations** with remediation steps
- **Performance optimization** suggestions
- **Team scaling advice** based on codebase complexity
- **Best practices recommendations** tailored to your tech stack

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **AI**: Google Gemini 2.5 Flash for analysis and chat
- **Deployment**: Vercel with automatic GitHub integration

## 📊 Scoring System

- **🏆 Platinum (90-100)**: World-class, production-ready
- **🥇 Gold (75-89)**: Excellent, minor improvements needed
- **🥈 Silver (50-74)**: Good foundation, needs work
- **🥉 Bronze (<50)**: Requires significant attention

## 🔒 Security & Privacy

- **No code storage**: SourceIQ analyzes repositories without storing code
- **API key rotation**: Automatic failover for reliability
- **Client-side processing**: Analysis runs in your browser
- **No data persistence**: Results are not stored on servers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for the Gemini API
- The open-source community for inspiration and tools
- All contributors who help improve SourceIQ

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Siddh-2006/SourceIQ/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Siddh-2006/SourceIQ/discussions)
- **Email**: [Contact](mailto:your-email@example.com)

---

**Made with ❤️ by the SourceIQ team**

Transform your code. Elevate your team. Ship with confidence.