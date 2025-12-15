import React from 'react';

// Enhanced text formatting utility for creative styling
export const formatEnhancedText = (text: string, className: string = '') => {
  if (!text) return <span className={className}></span>;

  // Split text by various markdown patterns and keywords
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\b(?:scored|maturity|security|performance|critical|urgent|architecture|deployment|quality|operational|lead|improve|excellent|outstanding|robust|scalable|maintainable|professional|enterprise|production|innovative|cutting-edge|vulnerability|failure|breach|attack|exploit|deprecated|outdated|missing|weak|poor|inadequate|exposed|insecure|unprotected|vulnerable|enhance|strengthen|implement|develop|maintain|optimize|modernize|upgrade)\b)/gi);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Handle **bold** markdown
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          return (
            <span 
              key={index} 
              className="font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-sm"
            >
              {content}
            </span>
          );
        }
        
        // Handle *italic* markdown
        if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
          const content = part.slice(1, -1);
          return (
            <span 
              key={index} 
              className="italic font-medium text-zinc-100 bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent"
            >
              {content}
            </span>
          );
        }
        
        // Handle `code` markdown
        if (part.startsWith('`') && part.endsWith('`')) {
          const content = part.slice(1, -1);
          return (
            <span 
              key={index} 
              className="font-mono text-sm bg-white/10 text-primary px-2 py-1 rounded border border-white/20 shadow-sm"
            >
              {content}
            </span>
          );
        }
        
        // Handle important keywords
        const isPositiveKeyword = /^(excellent|outstanding|robust|scalable|maintainable|professional|enterprise|production|innovative|cutting-edge|scored|maturity|quality|operational|lead|improve|enhance|strengthen|implement|develop|maintain|optimize|modernize|upgrade)$/i.test(part);
        const isNegativeKeyword = /^(critical|urgent|vulnerability|failure|breach|attack|exploit|deprecated|outdated|missing|weak|poor|inadequate|exposed|insecure|unprotected|vulnerable)$/i.test(part);
        const isNeutralKeyword = /^(security|performance|architecture|deployment)$/i.test(part);
        
        if (isPositiveKeyword) {
          return (
            <span 
              key={index} 
              className="font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm"
            >
              {part}
            </span>
          );
        }
        
        if (isNegativeKeyword) {
          return (
            <span 
              key={index} 
              className="font-bold text-white bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm"
            >
              {part}
            </span>
          );
        }
        
        if (isNeutralKeyword) {
          return (
            <span 
              key={index} 
              className="font-semibold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              {part}
            </span>
          );
        }
        
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

// Specialized formatter for risk content
export const formatRiskText = (text: string) => {
  return formatEnhancedText(text, 'text-zinc-200 leading-relaxed');
};

// Specialized formatter for team justification
export const formatTeamText = (text: string) => {
  return formatEnhancedText(text, 'text-zinc-300 leading-relaxed');
};

// Specialized formatter for executive summary
export const formatExecutiveSummary = (text: string) => {
  return formatEnhancedText(text, 'text-xl lg:text-2xl text-zinc-200 leading-relaxed font-light');
};

// Enhanced formatter with emoji and special styling
export const formatWithEmojis = (text: string) => {
  if (!text) return <span></span>;

  // Add emojis for certain patterns
  let enhancedText = text
    .replace(/\b(security|secure)\b/gi, '🔒 $1')
    .replace(/\b(performance|fast|speed)\b/gi, '⚡ $1')
    .replace(/\b(critical|urgent)\b/gi, '🚨 $1')
    .replace(/\b(excellent|outstanding)\b/gi, '✨ $1')
    .replace(/\b(vulnerability|vulnerable)\b/gi, '⚠️ $1')
    .replace(/\b(architecture|design)\b/gi, '🏗️ $1')
    .replace(/\b(testing|tests)\b/gi, '🧪 $1')
    .replace(/\b(documentation|docs)\b/gi, '📚 $1')
    .replace(/\b(deployment|deploy)\b/gi, '🚀 $1')
    .replace(/\b(monitoring|monitor)\b/gi, '📊 $1');

  return formatEnhancedText(enhancedText);
};

// Creative bullet point formatter
export const formatBulletPoints = (text: string) => {
  if (!text) return <span></span>;

  // Convert - or * at start of lines to styled bullets
  const lines = text.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          const content = trimmedLine.substring(2);
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                {formatEnhancedText(content, 'text-zinc-300 leading-relaxed')}
              </div>
            </div>
          );
        }
        
        if (trimmedLine.startsWith('1. ') || /^\d+\.\s/.test(trimmedLine)) {
          const match = trimmedLine.match(/^(\d+)\.\s(.+)$/);
          if (match) {
            const [, number, content] = match;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {number}
                </div>
                <div className="flex-1">
                  {formatEnhancedText(content, 'text-zinc-300 leading-relaxed')}
                </div>
              </div>
            );
          }
        }
        
        if (trimmedLine) {
          return (
            <div key={index}>
              {formatEnhancedText(trimmedLine, 'text-zinc-300 leading-relaxed')}
            </div>
          );
        }
        
        return null;
      }).filter(Boolean)}
    </div>
  );
};