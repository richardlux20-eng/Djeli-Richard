import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, AlertCircle, HelpCircle, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  {
    label: "🚀 Monétisation TikTok",
    text: "Comment activer ma monétisation TikTok et retirer mes gains depuis l'Afrique ?"
  },
  {
    label: "💳 Compte PayPal vérifié",
    text: "Comment puis-je créer un compte PayPal fonctionnel en réception depuis l'Afrique ?"
  },
  {
    label: "📱 Tunnel de vente gratuit",
    text: "Qu'est-ce qu'un tunnel de vente gratuit et comment l'automatiser sur WhatsApp ?"
  },
  {
    label: "💰 Tarifs et Offre Groupée",
    text: "Quels sont vos différents tarifs et comment fonctionne la réduction pour le Pack complet ?"
  }
];

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis l'assistant virtuel intelligent de Richard Services ⚡\n\nComment puis-je vous aider aujourd'hui ? Choisissez l'une de nos suggestions ci-dessous ou écrivez votre question directement !"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setErrorMsg(null);
    setLoading(true);

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");

    try {
      // Build full chat history to send to server
      const chatHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre le serveur de réponses.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content || "Je n'ai pas pu générer de réponse." }
      ]);
    } catch (err: any) {
      console.error("Floating Chat Error:", err);
      // Helpful automated offline/fallback guide if backend has any issue or key is absent
      let fallbackText = "Oups ! Je rencontre un problème de connexion temporaire, mais voici mes conseils automatisés :\n\n";
      
      const textLower = textToSend.toLowerCase();
      if (textLower.includes("tiktok") || textLower.includes("monétis") || textLower.includes("gagn")) {
        fallbackText += "🎬 **Monétisation TikTok** : Nous configurons votre compte TikTok éligible (basé en Europe/USA) et vous formons pour lier vos processeurs de paiement de façon sécurisée.\n\n👉 Tarif exceptionnel : 5 000 FCFA.";
      } else if (textLower.includes("paypal") || textLower.includes("compte") || textLower.includes("recev")) {
        fallbackText += "💳 **Compte PayPal** : Nous vous apprenons à configurer un compte PayPal récepteur 100% fonctionnel et validé en Afrique pour retirer vos euros/dollars localement.\n\n👉 Tarif : 4 000 FCFA.";
      } else if (textLower.includes("whatsapp") || textLower.includes("tunnel") || textLower.includes("vent")) {
        fallbackText += "📱 **WhatsApp & Tunnels de Vente** : Automatisation de votre messagerie professionnelle et intégration d'un tunnel gratuit pour capter des prospects en continu.\n\n👉 Tarif : 3 000 FCFA.";
      } else {
        fallbackText += "**Richard Services** propose des forfaits complets (TikTok, PayPal, WhatsApp et Marketing) à un tarif combo réduit à 12 000 FCFA seulement au lieu de 17 000 FCFA.\n\nN'hésitez pas à poser une autre question ou contactez directement Richard par WhatsApp !";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallbackText }
      ]);
      setErrorMsg("Connexion locale active. Pour un accompagnement direct, écrivez-nous sur WhatsApp !");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputVal);
  };

  return (
    <>
      {/* Floating Toggle Button with Red and Blue pulse */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Helper tooltip if closed */}
        {!isOpen && (
          <div className="mb-2 bg-blue-950 text-white text-[10px] sm:text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-blue-900 animate-bounce flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-red-500 animate-pulse" />
            <span>Assistance en ligne !</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setErrorMsg(null);
          }}
          type="button"
          className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer relative ${
            isOpen 
              ? "bg-red-650 hover:bg-red-700 hover:rotate-90" 
              : "bg-gradient-to-tr from-blue-950 via-blue-900 to-red-650 hover:shadow-red-500/20"
          }`}
          aria-label="Assistant en ligne"
          id="floating-assistant-toggle-btn"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">1</span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Floating Message Dashboard Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-4 sm:right-6 left-4 sm:left-auto w-auto sm:w-[380px] max-w-[calc(100vw-32px)] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in-up"
          id="floating-assistant-dialog"
          style={{ height: "min(520px, calc(100vh - 120px))" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 to-red-950 px-4 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-display font-black text-xs tracking-tighter">
                R12
              </div>
              <div>
                <h4 className="text-white text-xs sm:text-sm font-black tracking-tight leading-tight">Richard Services IA</h4>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-slate-400 capitalize">Réponses instantanées</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fermer la discussion"
              id="faq-close-bot-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message view segment */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-red-650 text-white rounded-tr-none"
                      : "bg-slate-820 text-slate-200 border border-slate-800 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[8px] text-slate-500 font-bold mt-1 uppercase tracking-wider px-1">
                  {msg.role === "user" ? "Vous" : "Richard Services Bot"}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex flex-col items-start max-w-[85%] mr-auto">
                <div className="p-3 bg-slate-820 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span className="text-[10px] font-semibold italic text-slate-400">Richard écrit...</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-950/40 border border-red-900/40 text-red-400 p-2.5 rounded-xl flex items-start gap-1 px-3">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="text-[10px] font-medium leading-normal">{errorMsg}</span>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* Automated Shortcuts Drawer Area */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/60 shrink-0">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Suggestions de questions :</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q.text)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-red-500/30 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl text-[10px] font-bold tracking-tight whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{q.label}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Input formulation area */}
          <form 
            onSubmit={handleFormSubmit}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Écrivez votre message de discussion..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
              id="bot-chat-input"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className={`p-2 rounded-xl text-white transition-all ${
                inputVal.trim() && !loading
                  ? "bg-red-650 hover:bg-red-700 active:scale-95 text-white cursor-pointer"
                  : "bg-slate-800 text-slate-600 pointer-events-none"
              }`}
              title="Envoyer le message"
              id="bot-send-chat-btn"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick WhatsApp Link fallback */}
          <div className="bg-slate-950 px-4 py-2 text-[10px] text-center border-t border-slate-850 shrink-0">
            <a
              href="https://wa.me/2250576075614?text=Bonjour%20Richard%20Services%2C%20j'aimerais%20avoir%20plus%20d'informations%20en%20direct."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline font-extrabold flex items-center justify-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-ping"></span>
              Besoin de lui parler en direct ? Échanger sur WhatsApp 🟢
            </a>
          </div>

        </div>
      )}
    </>
  );
}
