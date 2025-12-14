import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Bot, User, Sparkles, Terminal } from 'lucide-react';
import { ChatMessage, FullReport } from '../types';
import { chatWithRepo } from '../services/geminiService';
import { clsx } from 'clsx';

interface ChatInterfaceProps {
  report: FullReport;
}

// Custom Text Formatter to make "raw" AI answers look premium
const FormattedText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, i) => {
         // Detect bullet points
         const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().match(/^\d+\./);
         const cleanLine = line.replace(/^[-•]\s+|^\d+\.\s+/, '');
         
         // Parse bold (**text**) and code (`text`)
         const content = cleanLine.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
               return <strong key={j} className="text-white font-bold tracking-wide">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
               return <code key={j} className="bg-white/10 px-1.5 py-0.5 rounded text-accent font-mono text-xs border border-white/5">{part.slice(1, -1)}</code>;
            }
            return part;
         });

         if (isBullet) {
            return (
              <div key={i} className="flex gap-2 ml-1 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 block shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span className="text-zinc-300">{content}</span>
              </div>
            );
         }
         
         if (!line.trim()) return <div key={i} className="h-2" />;
         
         return <div key={i} className="text-zinc-300">{content}</div>
      })}
    </div>
  )
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ report }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `**System Online.** \nI have audited ${report.repo_metadata.name}. \n\nAsk me about:\n- **Hidden security risks**\n- **Scalability bottlenecks**\n- **Refactoring candidates**` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await chatWithRepo(messages, userMsg.text, report, report.repo_url);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection interrupted. Re-establishing link..." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button with Glow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-500 hover:scale-110 group",
          isOpen ? "bg-surfaceHighlight text-white rotate-90" : "bg-gradient-to-r from-primary to-secondary text-white"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-pulse" />}
      </button>

      {/* Glassmorphism Chat Window */}
      <div className={clsx(
        "fixed bottom-24 right-4 md:right-8 w-[95vw] md:w-[450px] max-w-[450px] bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right",
        isOpen ? "h-[80vh] md:h-[650px] opacity-100 scale-100 translate-y-0" : "h-0 opacity-0 scale-90 translate-y-10 pointer-events-none"
      )}>
        
        {/* Header with animated gradient border bottom */}
        <div className="relative bg-white/5 p-5 flex items-center gap-4">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="relative">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
               <Bot size={20} />
             </div>
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-[#09090b]" />
          </div>
          
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
              SourceIQ Assistant
              <span className="px-1.5 py-0.5 rounded bg-primary/20 text-[10px] text-primary border border-primary/20 uppercase">Beta</span>
            </h3>
            <p className="text-zinc-400 text-xs flex items-center gap-1">
              <Terminal size={10} />
              Connected to repo context
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div key={idx} className={clsx("flex gap-4 animate-slide-up", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              
              {/* Avatar */}
              <div className={clsx(
                "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg mt-1",
                msg.role === 'user' ? "bg-zinc-800 text-zinc-400" : "bg-gradient-to-br from-primary/20 to-secondary/20 text-primary border border-primary/20"
              )}>
                {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>

              {/* Message Bubble */}
              <div className={clsx(
                "p-4 rounded-2xl max-w-[85%] shadow-sm backdrop-blur-sm",
                msg.role === 'user' 
                  ? "bg-zinc-800/80 text-white rounded-tr-sm border border-white/5" 
                  : "bg-white/5 text-zinc-100 rounded-tl-sm border border-white/5"
              )}>
                {msg.role === 'model' ? <FormattedText text={msg.text} /> : <p className="text-sm leading-relaxed">{msg.text}</p>}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 animate-pulse">
               <div className="w-8 h-8 rounded-lg bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary border border-primary/20 mt-1">
                 <Bot size={14} />
               </div>
               <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-2">
                 <Loader2 className="animate-spin text-primary" size={16} />
                 <span className="text-xs text-zinc-500 font-mono">Analyzing codebase...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 rounded-xl blur transition-opacity duration-500 -z-10" />
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your code..."
              className="w-full bg-[#09090b] border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors shadow-inner"
            />
            
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 p-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-primary/50"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-zinc-600 font-mono">AI generated content may be inaccurate.</p>
          </div>
        </div>

      </div>
    </>
  );
};
