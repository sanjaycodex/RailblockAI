import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, CornerDownLeft, ShieldCheck, Zap } from 'lucide-react';
import { api } from '../../services/api';

const SUGGESTED_PROMPTS = [
  'Find optimal 3-hour window for Track Tamping on Kovilpatti - Satur UP line',
  'Bundle USFD rail flaw repair with 25kV OHE catenary adjustment (MEJ-CVP)',
  'Show conflict impact on 20666 Vande Bharat Express for tomorrow morning',
  'What is the average asset health index across the Tirunelveli-Madurai line?'
];

export default function AIAssistantDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Hello, Officer! I am **RailBlock Copilot**, your AI assistant for the **Tirunelveli – Madurai (TEN-MDU)** corridor on Southern Railway. How can I assist with block scheduling, de-conflicting, or defect bundling today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [liveContext, setLiveContext] = useState(null);

  // Fetch live context when drawer opens
  useEffect(() => {
    if (isOpen && !liveContext) {
      fetchLiveContext();
    }
  }, [isOpen]);

  const fetchLiveContext = async () => {
    try {
      const summary = await api.getDashboardSummary();
      setLiveContext({
        tasks: summary.totalTasks || 0,
        critical_tasks: summary.criticalTasks || 0,
        sections: summary.sections 
          ? summary.sections
              .map(s => s.section_code || s.id || s.section_name)
              .filter(s => s)  // Remove null/undefined values
              .slice(0, 6)
          : []
      });
    } catch (error) {
      console.error('Failed to fetch live context:', error);
      setLiveContext(null);  // Set to null if fetch fails
    }
  };

  if (!isOpen) return null;

  const handleSend = async (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call Groq API through backend
      // Filter out the initial welcome message (msg-1) from conversation history
      // Also ensure text is not null/undefined
      const conversationHistory = [...messages, userMsg]
        .filter(msg => {
          // Exclude welcome message
          if (msg.id === 'msg-1') return false;
          // Ensure text exists and is not empty
          if (!msg.text || typeof msg.text !== 'string' || !msg.text.trim()) return false;
          return true;
        })
        .slice(-10); // Last 10 messages for context
      
      console.log('[AI Copilot] Sending messages:', conversationHistory);
      console.log('[AI Copilot] Live context:', liveContext);
      
      const aiResponse = await api.sendChatMessage(conversationHistory, liveContext);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: aiResponse,
          time: 'Just now'
        }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '⚠️ AI service temporarily unavailable. The backend may not be running or Groq API key is not configured. Please check the console for details.',
          time: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#002869] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl ai-gradient flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">RailBlock AI Copilot</h3>
                <span className="text-[10px] font-mono text-blue-200">Tirunelveli - Madurai Mainline</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#faf8ff]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#002869] text-white flex items-center justify-center text-[10px] font-bold mt-1 flex-shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs ${
                    m.sender === 'user'
                      ? 'bg-[#002869] text-white rounded-br-none shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                  <span className={`text-[9px] font-mono block mt-1 ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono italic">
                <Sparkles className="w-3.5 h-3.5 text-[#005db7] animate-spin" />
                Groq AI analyzing railway network...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-white border-t border-slate-100 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[#747783] uppercase block">Suggested Queries:</span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_PROMPTS.slice(0, 2).map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="text-[11px] font-mono text-left px-2.5 py-1 rounded-lg bg-[#f4f3fb] hover:bg-[#e9edff] text-[#002869] border border-slate-200 truncate max-w-full cursor-pointer transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about slot availability, conflicts, or bundling..."
                className="w-full pl-3 pr-10 py-2.5 bg-[#f4f3fb] border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#005db7] transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#002869] text-white rounded-lg hover:bg-[#0b3d91] transition-colors cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
