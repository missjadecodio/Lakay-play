import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, PhoneCall, MessageSquare, Bot, User, CheckCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const LiveChatSupportModal: React.FC = () => {
  const { isSupportChatOpen, setIsSupportChatOpen, supportPhone, whatsappGroupLink, language } = useApp();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Bonswa! Byenvini sou sèvis Asistans Lakay Play 🇭🇹. Kòman nou ka ede w jodi a? Ou gen kesyon sou depo/retrè MonCash, Natcash, oswa sou jwèt Morpion ak Domino?',
      time: 'Kounye a',
    },
  ]);

  if (!isSupportChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');

    // Automated smart assistant response
    setTimeout(() => {
      let reply = 'Mèsi pou mesaj ou a! Yon ajan Lakay Play ap reponn ou rapid. Ou ka rele nou dirèkteman oswa ekri sou WhatsApp nan ' + supportPhone + '.';
      if (query.includes('depo') || query.includes('moncash') || query.includes('natcash') || query.includes('kòb') || query.includes('depot')) {
        reply = 'Pou fè depo sou MonCash oswa Natcash, ale nan onglet "Bous", tape montan an epi antre nimewo telefòn ou. Montan an ap kredite sou kont ou otomatikman nan 10 segonn!';
      } else if (query.includes('retrè') || query.includes('retrait') || query.includes('retire')) {
        reply = 'Retrè yo disponib 24 sou 24, a nenpòt ki lè! Ale nan onglet "Bous", klike sou "Retrè", chwazi MonCash oswa Natcash, epi antre nimewo w. Kòb la voye dirèkteman sou telefòn ou.';
      } else if (query.includes('morpion') || query.includes('5')) {
        reply = 'Sou Morpion Lakay Play, règ la se alinye 5 pyon (orizontal, vètikal oswa dyagonal) sou yon gwo griy. Ou ka jwe gratis oswa mete miz an goud kont lòt jwè an liy!';
      } else if (query.includes('tournwa') || query.includes('tournoi')) {
        reply = 'Gade nan onglet "Tournwa" pou wè tout gwo chanpyona ki louvri. Ou ka enskri ak yon sèl klik epi goumen pou ranpòte gwo kach la!';
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="w-full sm:w-96 h-[85vh] sm:h-[550px] bg-slate-900 border border-slate-700 sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-red-900 p-4 border-b border-slate-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm">Asistans Lakay Play</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-300">Nimewo: {supportPhone}</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportChatOpen(false)}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Bar */}
        <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
          <a
            href={`tel:${supportPhone}`}
            className="flex items-center gap-1.5 text-amber-400 hover:underline font-semibold"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Rele</span>
          </a>
          <span className="text-slate-600">|</span>
          <a
            href={`https://wa.me/${supportPhone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:underline font-semibold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          <span className="text-slate-600">|</span>
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:underline font-semibold text-[11px]"
          >
            Gwoup Nou
          </a>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse text-right' : 'text-left'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                <div
                  className={`flex items-center gap-1 text-[9px] mt-1 ${
                    msg.sender === 'user' ? 'text-slate-800 justify-end' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-slate-800" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-2 bg-slate-900 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setInputText('Kòman pou m fè depo MonCash?')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white text-[11px] border border-slate-700"
          >
            Depo MonCash
          </button>
          <button
            type="button"
            onClick={() => setInputText('Èske retrè yo disponib tout lè?')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white text-[11px] border border-slate-700"
          >
            Retrè 24/7
          </button>
          <button
            type="button"
            onClick={() => setInputText('Kòman Morpion 5 pyon an mache?')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white text-[11px] border border-slate-700"
          >
            Morpion 5 Pyon
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={language === 'ht' ? 'Ekri mesaj ou isit la...' : 'Écrivez votre message...'}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
