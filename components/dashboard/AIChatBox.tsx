"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Sparkles, Loader2, MinusSquare } from "lucide-react";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
};

export default function AIChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "ai",
            content: "Hello! I am your AI Investment Copilot. You can ask me about your portfolio, specific stocks, or general market strategies. How can I help you today?",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [messages, isOpen, isMinimized, isTyping]);

    const generateAIResponse = (query: string): string => {
        const text = query.toLowerCase();

        if (text.includes("sell") && text.includes("crashing")) {
            return "If a stock is crashing wildly, check the underlying fundamentals. If the drop is due to broader market panic rather than a company-specific failure, it might be a 'Value Buy' opportunity rather than a signal to sell. Conversely, if it broke key support levels with high volume, cutting your losses (Stop-Loss) is the safest strategy to preserve capital.";
        }
        if (text.includes("benefit") || text.includes("buying")) {
            return "The primary benefit of buying a fundamentally strong stock during a crash is the 'Margin of Safety'. You acquire the asset at a steep discount to its intrinsic value, positioning yourself for aggressive upward momentum once the market stabilizes. However, you must be prepared to hold through short-term volatility.";
        }
        if (text.includes("tcs") || text.includes("infosys") || text.includes("wipro") || text.includes("it ")) {
            return "The Indian IT Sector is currently facing macroeconomic headwinds from North America and Europe, causing margin compression. However, large-cap players like TCS and Infosys are defensively strong with high dividend yields and massive cash reserves. They are excellent long-term holds at current valuations.";
        }
        if (text.includes("nifty") || text.includes("market")) {
            return "The NIFTY 50 is experiencing rotation. Domestic Institutional Investors (DIIs) and retail SIPs are aggressively absorbing Foreign portfolio outflows. Keep your portfolio diversified and hedge with defensive FMCG or Pharma names during uncertainty.";
        }
        if (text.includes("portfolio")) {
            return "Your portfolio currently reflects your simulated trades. Remember to properly diversify across 4-5 different sectors to minimize unsystematic risk. A good rule of thumb is allocating no more than 15% to a single equity.";
        }

        // Generic fallback responses
        const fallbacks = [
            "That's an excellent question. While technical indicators point towards volatility, my neural net suggests maintaining a disciplined structural approach—don't let emotional trading override logic.",
            "Based on current market momentum and historical quantitative models, I recommend setting strict stop-losses on speculative trades while averaging down on highly-convicted core holdings.",
            "I'm continuously scanning global data feeds. The current setup implies we might see a breakout soon if key resistance levels are breached with volume backing it up. Proceed cautiously.",
            "In the current macroeconomic climate characterized by unpredictable interest rate cycles, prioritizing capital preservation over aggressive growth is often the optimal strategy."
        ];

        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate AI thinking delay (1.5s to 3s)
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: generateAIResponse(userMessage.content),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // FAB only
    if (!isOpen) {
        return (
            <button
                onClick={() => { setIsOpen(true); setIsMinimized(false); }}
                className="fixed bottom-20 md:bottom-8 right-6 z-50 p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-110 flex items-center justify-center group"
            >
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="absolute right-full mr-4 bg-slate-900 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                    Ask AI Advisor
                </span>
            </button>
        );
    }

    // Minimized chat
    if (isMinimized) {
        return (
            <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl flex items-center justify-between p-3 cursor-pointer hover:bg-slate-800 transition-colors w-64" onClick={() => setIsMinimized(false)}>
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-full">
                        <Bot className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="font-bold text-sm text-slate-200">AI Copilot Active</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-slate-400 hover:text-red-400 p-1">
                    <X className="w-5 h-5" />
                </button>
            </div>
        );
    }

    // Full Chat Box
    return (
        <div className="fixed bottom-20 md:bottom-8 right-0 md:right-8 z-50 w-full md:w-[400px] h-[75vh] md:h-[600px] max-h-[800px] bg-slate-900 border-t md:border border-slate-700/50 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">

            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg relative">
                        <Bot className="w-6 h-6 text-emerald-400" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-100 leading-tight">Antigravity AI</h3>
                        <p className="text-[11px] text-emerald-400 font-medium">Financial Copilot Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsMinimized(true)} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                        <MinusSquare className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900/50">
                <div className="text-center mb-6">
                    <p className="text-xs text-slate-500 bg-slate-800/50 inline-block px-3 py-1 rounded-full border border-slate-700/50">
                        End-to-End Encrypted Neural Session
                    </p>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-slate-700" : "bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]"}`}>
                                {msg.role === "user" ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-5 h-5 text-white" />}
                            </div>
                            <div className={`p-3 rounded-2xl ${msg.role === "user"
                                    ? "bg-slate-700 text-slate-100 rounded-tr-none"
                                    : "bg-slate-800 border border-slate-700/50 text-slate-200 rounded-tl-none shadow-lg"
                                }`}>
                                <p className="text-sm shadow-sm leading-relaxed">{msg.content}</p>
                                <span className={`text-[10px] mt-1.5 block ${msg.role === "user" ? "text-slate-400 text-right" : "text-slate-500"}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[85%] flex-row">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="p-4 bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-lg">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
                <div className="relative flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about TCS, crashing stocks, etc..."
                        className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500 resize-none max-h-32 min-h-[48px]"
                        rows={1}
                        style={{ height: "auto" }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 bottom-2 p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center h-8 w-8"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center">
                    AI generated insight. Verify before making financial moves.
                </p>
            </div>

        </div>
    );
}
