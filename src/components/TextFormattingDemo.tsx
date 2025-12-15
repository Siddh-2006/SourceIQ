import React from 'react';
import { formatEnhancedText, formatWithEmojis, formatBulletPoints } from '../utils/textFormatting';

export const TextFormattingDemo: React.FC = () => {
  const sampleTexts = {
    markdown: "This repository shows **excellent** code quality with *robust* architecture and `modern` deployment practices.",
    keywords: "The security analysis reveals critical vulnerabilities that need urgent attention. Performance optimization and scalable architecture improvements are recommended.",
    bulletPoints: `- Implement comprehensive security measures
- Optimize performance bottlenecks  
- Enhance documentation quality
- Strengthen testing coverage
1. Review authentication mechanisms
2. Update deprecated dependencies
3. Implement monitoring solutions`,
    mixed: "**Critical**: The application has outstanding performance but shows vulnerability in security. Testing coverage needs improvement and deployment automation requires enhancement."
  };

  return (
    <div className="p-8 space-y-8 bg-surface/30 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">Enhanced Text Formatting Demo</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Markdown Formatting</h3>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            {formatEnhancedText(sampleTexts.markdown)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Keyword Highlighting</h3>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            {formatEnhancedText(sampleTexts.keywords)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Emoji Enhancement</h3>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            {formatWithEmojis(sampleTexts.keywords)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Bullet Points</h3>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            {formatBulletPoints(sampleTexts.bulletPoints)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Mixed Formatting</h3>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            {formatWithEmojis(sampleTexts.mixed)}
          </div>
        </div>
      </div>
    </div>
  );
};