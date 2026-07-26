'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Phone, Bot } from 'lucide-react';
import { Button } from '../ui/Button';

export const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Halo! Selamat datang di GymEase. Ada yang bisa kami bantu mengenai booking gym atau sewa baju & handuk?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    // Automated bot reply
    setTimeout(() => {
      let reply = 'Terima kasih telah menghubungi GymEase! Staf customer support kami sedang bersiap melayani Anda.';
      if (userMsg.toLowerCase().includes('baju') || userMsg.toLowerCase().includes('sewa')) {
        reply = 'Setiap cabang GymEase menyediakan sewa baju dry-fit premium (ukuran XS - XXL) dan handuk microfiber bersih langsung di lokasi!';
      } else if (userMsg.toLowerCase().includes('lokasi') || userMsg.toLowerCase().includes('cabang')) {
        reply = 'GymEase memiliki partner gym di Kemanggisan, Grogol, BSD, Bekasi, Tangerang, dan Depok!';
      }
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href="https://wa.me/6281234567890?text=Halo%20GymEase,%20saya%20ingin%20tanya%20mengenai%20booking%20gym"
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110"
          title="Contact via WhatsApp"
        >
          <Phone className="w-6 h-6" />
        </a>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
          title="Open GymEase Support Chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[450px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">GymEase Assistant</h4>
                <span className="text-[10px] text-rose-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <Button type="submit" size="sm" className="px-3 py-2">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
