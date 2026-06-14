import React, { useState, useRef, useEffect } from "react";
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Search, X } from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  whatsappText: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "q1",
    category: "Monétisation",
    question: "Comment activer ma monétisation TikTok ?",
    answer: "Richard Services s'occupe de la configuration complète pour activer votre monétisation en toute sécurité, même dans les zones non éligibles.",
    whatsappText: "Bonjour Richard Services, je souhaite activer ma monétisation TikTok et j'aimerais avoir plus de détails sur vos services."
  },
  {
    id: "q2",
    category: "Retrait d'argent",
    question: "Comment retirer mon argent gagné sur TikTok ?",
    answer: "Nous vous formons sur les méthodes exactes pour lier un compte adapté et effectuer vos retraits directement depuis l'Afrique sans blocage.",
    whatsappText: "Bonjour Richard Services, je souhaite savoir comment retirer mon argent gagné sur TikTok depuis l'Afrique."
  },
  {
    id: "q3",
    category: "PayPal",
    question: "Puis-je créer un compte PayPal fonctionnel en Afrique ?",
    answer: "Oui, notre formation vous apprend à configurer un compte PayPal 100% vérifié pour envoyer et recevoir vos fonds internationaux.",
    whatsappText: "Bonjour Richard Services, je souhaite créer un compte PayPal fonctionnel depuis l'Afrique."
  },
  {
    id: "q4",
    category: "Tunnel de vente",
    question: "Qu'est-ce qu'un tunnel de vente gratuit ?",
    answer: "C'est un système automatique sur vos réseaux (comme WhatsApp Business) pour accueillir et convertir vos prospects en clients sans frais.",
    whatsappText: "Bonjour Richard Services, je souhaite en savoir plus sur la mise en place d'un tunnel de vente gratuit pour mon activité."
  }
];

const FAQAccordionItem: React.FC<{
  item: FAQItem;
  isOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
}> = ({
  item,
  isOpen,
  onClick,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  // Adjust height dynamically on container resize
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(`${entry.target.scrollHeight}px`);
      }
    });
    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [isOpen]);

  const encodedText = encodeURIComponent(item.whatsappText);
  const whatsappUrl = `https://wa.me/2250576075614?text=${encodedText}`;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-red-400 shadow-md shadow-red-500/5 ring-1 ring-red-100"
          : "border-gray-150 shadow-sm hover:border-blue-200"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left px-5 py-4 sm:py-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-blue-950 hover:text-blue-900 focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-105/50 px-2.5 py-1 rounded-md hidden sm:inline-block">
            {item.category}
          </span>
          <span className="font-bold text-blue-950 text-sm sm:text-base leading-snug">
            {item.question}
          </span>
        </div>
        <span
          className={`p-1.5 rounded-full transition-transform duration-200 ${
            isOpen ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
          } shrink-0`}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* Dynamic Accordion Body with ScrollHeight transition */}
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="transition-all duration-300 ease-in-out bg-slate-50/50 overflow-hidden"
      >
        <div className="py-4 px-5 space-y-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
            {item.answer}
          </p>
          <div className="pt-1.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#25D366]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </div>
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contacter Richard pour cette offre</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState<string | null>("q1");
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Ensure and simulate DOMContentLoaded behavior
  useEffect(() => {
    const handleDOMContentLoaded = () => {
      console.log("FAQ Accordion System initialized on DOMContentLoaded.");
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
    } else {
      handleDOMContentLoaded();
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);
    };
  }, []);

  const categories = ["Tous", "Monétisation", "Retrait d'argent", "PayPal", "Tunnel de vente"];

  // Filter based on selected category AND keyword search
  const filteredFAQs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "Tous" || item.category === activeCategory;

    const searchLower = searchQuery.toLowerCase().trim();
    if (searchLower === "") return matchesCategory;

    const matchesSearch =
      item.question.toLowerCase().includes(searchLower) ||
      item.answer.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  const handleToggle = (e: React.MouseEvent, itemId: string) => {
    // Explicit preventDefault() to avoid scroll/page jumping on phone / viewport resets
    e.preventDefault();
    setOpenQuestion((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <section className="py-16 bg-slate-50 border-t border-gray-150" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header with blue & red theme contrast */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-650 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Assistance Clientèle</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-blue-950">
            Questions Fréquentes <span className="text-red-650">& Réponses</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Trouvez instantanément des réponses claires sur l'activation TikTok, le paramétrage PayPal et l'accompagnement de Richard.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6 relative">
          <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-red-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100/50 transition-all">
            <div className="pl-4 text-blue-900 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenQuestion(null);
              }}
              placeholder="Rechercher une question ou mot-clé... (ex: Monétisation, PayPal)"
              className="w-full text-blue-950 placeholder-gray-400 bg-transparent text-xs sm:text-sm py-3.5 pl-3 pr-10 focus:outline-none rounded-2xl"
              id="faq-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setOpenQuestion(null);
                }}
                className="absolute right-3 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Effacer la recherche"
                id="faq-clear-search-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search status / count */}
        {searchQuery && (
          <div className="text-center mb-6 text-xs text-gray-500">
            Nous avons trouvé <span className="text-red-650 font-bold">{filteredFAQs.length}</span> {filteredFAQs.length > 1 ? "questions" : "question"} pour « <span className="font-semibold text-blue-950">{searchQuery}</span> »
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenQuestion(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-blue-950 text-white shadow-sm ring-1 ring-blue-900"
                  : "bg-white text-gray-650 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion container */}
        <div className="space-y-3">
          {filteredFAQs.map((item) => (
            <FAQAccordionItem
              key={item.id}
              item={item}
              isOpen={openQuestion === item.id}
              onClick={(e) => handleToggle(e, item.id)}
            />
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-150 shadow-sm">
              <p className="text-sm text-gray-500">Aucune réponse ne correspond à votre recherche ou catégorie.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("Tous");
                  setOpenQuestion(null);
                }}
                className="mt-3 text-xs text-red-600 hover:text-red-800 font-bold transition-colors cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>

        {/* Call to action card */}
        <div className="mt-10 bg-[#0d1b2a] text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-900 shadow-lg relative overflow-hidden">
          {/* Subtle red custom design gradient corner support for theme */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-650/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="text-center sm:text-left z-10">
            <h4 className="font-display font-extrabold text-sm sm:text-base text-white">
              Une autre interrogation technique ?
            </h4>
            <p className="text-xs text-blue-200 mt-1 max-w-md font-sans">
              Richard répond personnellement à toutes vos interrogations spécifiques sous quelques minutes sur WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/2250576075614?text=Bonjour%20Richard%2C%20j'ai%20consult%C3%A9%20votre%20FAQ%20et%20j'aimerais%20vous%20poser%20une%20question%20compl%C3%A9mentaire."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#25D366]/20 transition-all hover:scale-105 cursor-pointer z-10"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Échanger en direct</span>
          </a>
        </div>

      </div>
    </section>
  );
}
