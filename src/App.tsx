import React, { useState, useEffect } from "react";
import { Service } from "./types";
import ServiceCard from "./components/ServiceCard";
import ServiceCalculator from "./components/ServiceCalculator";
import ReviewList from "./components/ReviewList";
import FAQSection from "./components/FAQSection";
import FloatingAssistant from "./components/FloatingAssistant";
import { 
  MessageSquare, 
  LogOut, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Smartphone, 
  ChevronRight,
  HelpCircle,
  ThumbsUp,
  ExternalLink
} from "lucide-react";

const SERVICES: Service[] = [
  {
    id: "tiktok",
    title: "Monétisation TikTok",
    price: 5000,
    badge: "Populaire 🔥",
    problem: "Bloqué par la monétisation ou retrait de fonds impossible en Afrique ?",
    solution: "Nous configurons votre compte éligible et nous vous formons sur les méthodes exactes pour retirer votre argent de TikTok facilement.",
    longDescription: "• Création de compte TikTok basé en zone éligible (Europe/USA) directement depuis l'Afrique.\n• Activation du fonds pour les créateurs et du programme Bêta pour la création de contenu.\n• Tutoriel pas-à-pas pour lier vos processeurs de paiement (PayPal, intermédiaires agréés).\n• Retrait direct de vos gains vers Wave, Orange Money ou MTN Mobile Money.",
    whatsAppText: "Bonjour Richard, je souhaite activer la monétisation TikTok et savoir comment retirer mon argent."
  },
  {
    id: "paypal",
    title: "Création de Comptes PayPal",
    price: 4000,
    problem: "Besoin d'une formation pour créer ton compte PayPal fonctionnel en réception ?",
    solution: "Bénéficiez d'une formation complète pour créer et configurer un compte PayPal 100% vérifié et fonctionnel pour envoyer et recevoir vos fonds sans risque de blocage.",
    longDescription: "• Méthodologie légale pour ouvrir un compte PayPal récepteur depuis un pays traditionnellement restreint.\n• Procédure de vérification d'identité et de liaison de cartes bancaires (ex: carte UBA, Djamo, etc.).\n• Stratégies de sécurité pour éviter les suspensions de fonds et valider vos opérations.\n• Méthodes efficaces de rapatriement d'argent vers vos comptes Wave ou Mobile Money locaux.",
    whatsAppText: "Bonjour Richard, je veux suivre la formation pour créer mon compte PayPal."
  },
  {
    id: "whatsapp",
    title: "Formation WhatsApp Business",
    price: 3000,
    problem: "Comment créer son tunnel de vente gratuit et automatiser sa messagerie ?",
    solution: "Apprenez à automatiser votre business, configurer des messages professionnels et créer un tunnel de vente performant et entièrement gratuit.",
    longDescription: "• Configuration optimale de votre profil professionnel et de votre catalogue d'articles.\n• Paramétrage de répondeurs automatiques, messages d'absence intelligents et raccourcis de réponses rapides.\n• Méthode complète du tunnel de vente organique WhatsApp pour drainer des clients depuis Facebook et Instagram.\n• Organisation de vos prospects avec des étiquettes de suivi intelligentes.",
    whatsAppText: "Bonjour Richard, je suis intéressé par la formation WhatsApp Business et la création de tunnel de vente gratuit."
  },
  {
    id: "marketing",
    title: "Marketing Digital & Réseaux Sociaux",
    price: 5000,
    problem: "Manque de visibilité ou besoin de formation pratique pour attirer des clients ?",
    solution: "Profitez de nos formations en marketing et de notre assistance personnalisée pour structurer vos réseaux sociaux et attirer des clients qualifiés chaque jour.",
    longDescription: "• Fondements essentiels : ciblage d'audience, branding professionnel et proposition d'offre irrésistible.\n• Stratégie de publication de contenu : créer des vidéos et des visuels qui déclenchent des ventes.\n• Atelier d'initiation Canva pour concevoir des affiches publicitaires accrocheuses en quelques clics.\n• Clés du référencement et des partenariats pour doubler votre visibilité organique en Afrique.",
    whatsAppText: "Bonjour Richard, j'ai besoin d'assistance et de conseils pour mon Marketing Digital."
  }
];

export default function App() {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(["tiktok"]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleToggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenWhatsAppOrder = (rawText: string) => {
    const encoded = encodeURIComponent(rawText);
    window.open(`https://wa.me/2250576075614?text=${encoded}`, "_blank");
  };

  const handleQuickExit = () => {
    // Immediate incognito safety exit redirect requested by user
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Banner Support Alert / Quick exit bar */}
      <div className="bg-blue-950 text-slate-300 py-2.5 px-4 text-xs font-semibold border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Conseiller Richard disponible en direct <strong>sur WhatsApp</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline font-mono text-[10px] text-slate-400">⚡ Accompagnement Rapide & Garanti</span>
            <button 
              onClick={() => setShowExitConfirm(true)}
              className="group flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors bg-red-950/40 hover:bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-900/30 font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              <span>Quitter le site</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Exit Modal Backdrop */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-100 shadow-2xl relative">
            <h3 className="font-display font-extrabold text-lg text-blue-950 mb-2">Navigation Sécurisée</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Voulez-vous quitter immédiatement ce site et retourner sur Google de manière sécurisée ? Votre panier temporaire sera effacé.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Rester ici
              </button>
              <button 
                onClick={handleQuickExit}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-colors"
              >
                Oui, quitter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header navigation */}
      <header className="bg-white/95 backdrop-blur sticky top-0 z-40 border-b border-gray-100 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-display font-black text-lg shadow-md shadow-blue-900/10 tracking-tighter">
              R12
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-tight text-blue-950 block leading-tight">RICHARD SERVICES</span>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-widest block -mt-0.5">Accompagnement Digital</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#services-view" className="text-sm font-semibold text-gray-650 hover:text-blue-600 transition-colors">Nos Services</a>
            <a href="#calculator-section" className="text-sm font-semibold text-gray-650 hover:text-blue-600 transition-colors">Calculateur</a>
            <a href="#faq-section" className="text-sm font-semibold text-gray-650 hover:text-blue-600 transition-colors">FAQ</a>
            <a href="#testimonials" className="text-sm font-semibold text-gray-650 hover:text-blue-600 transition-colors">Avis Clients</a>
          </nav>

          <div>
            <button
              onClick={() => handleOpenWhatsAppOrder("Bonjour Richard Services, je souhaite en savoir plus sur vos offres d'accompagnement.")}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-[#25D366]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Discuter en ligne</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-950 to-blue-900 text-white relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-800 text-xs text-blue-300 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>RICHARD V12 SERVICES : Votre Succès Numérique Assuré</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Propulsez Votre Présence et Vos Revenus en Ligne
          </h1>

          <p className="text-slate-350 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-normal">
            Bénéficiez d'un accompagnement digital sur-mesure d'experts. Maîtrisez la monétisation TikTok, PayPal sécurisé, l'automatisation WhatsApp et le marketing pour attirer des clients en continu.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#services-view"
              className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-sm font-extrabold shadow-lg shadow-blue-500/20 active:translate-y-0.5 transition-all cursor-pointer"
            >
              Découvrir nos solutions
            </a>
            <button 
              onClick={() => handleOpenWhatsAppOrder("Bonjour Richard Services, je souhaite me faire accompagner sur mes projets Internet.")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3.5 rounded-xl text-sm font-extrabold shadow-md shadow-[#25D366]/10 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 shrink-0" />
              Rejoindre sur WhatsApp
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-blue-900/50 mt-10">
            <div className="text-center p-2">
              <div className="font-display font-black text-2xl text-blue-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Comptes configurés vérifiés</div>
            </div>
            <div className="text-center p-2">
              <div className="font-display font-black text-2xl text-blue-400">48h</div>
              <div className="text-xs text-slate-400 mt-0.5">Délai moyen d'activation</div>
            </div>
            <div className="text-center p-2">
              <div className="font-display font-black text-2xl text-blue-400">+500</div>
              <div className="text-xs text-slate-400 mt-0.5">Élèves & clients formés</div>
            </div>
            <div className="text-center p-2">
              <div className="font-display font-black text-2xl text-blue-400">Services</div>
              <div className="text-xs text-slate-400 mt-0.5">Garantis ou assistés</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Structured grid of values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Qui sommes-nous ?</span>
          <h2 className="font-display font-extrabold text-3xl text-blue-950">Accompagnement et Maîtrise Digitale</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed">
            <strong>RICHARD V12 SERVICES</strong> est un cabinet à taille humaine spécialisé dans l'émancipation numérique. Notre objectif est d'aider les particuliers et les entrepreneurs africains et mondiaux à surmonter les blocages géographiques afin de générer des revenus fiables grâce au numérique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-blue-950 text-base">Contournement de blocages</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Troubles de retraits TikTok, blocages de fonds PayPal et barrières géographiques résolus durablement avec professionnalisme.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-blue-950 text-base">Formations Pratiques</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Pas de théorie inutile. Nous vous montrons en vidéo et en direct l'utilisation exacte des outils indispensables à votre business.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 h-12 w-12 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-blue-950 text-base">Suivi Personnel Direct</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Chaque module donne lieu à des discussions d'accompagnement directes avec Richard, expert de proximité à votre écoute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Core services area */}
      <section id="services-view" className="bg-gray-100/60 py-16 border-y border-gray-150 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Espace Solutions & Formations</span>
            <h2 className="font-display font-extrabold text-3xl text-blue-950">Nos Formations & Services Clés en Main</h2>
            <p className="text-sm text-gray-500 mt-2">
              Cliquez pour approfondir un module ou contactez directement Richard sur WhatsApp pour commencer.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {SERVICES.map((srv) => (
              <ServiceCard
                key={srv.id}
                service={srv}
                onSelect={handleToggleService}
                isSelectedInCalculator={selectedServiceIds.includes(srv.id)}
                onWhatsAppOrder={handleOpenWhatsAppOrder}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Pricing Planner & Customized WhatsApp request */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Formulaire Sur-Mesure</span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-blue-950">Configurez Votre Pack de Services</h2>
          <p className="text-sm text-gray-500 mt-2">
            Bénéficiez de remises groupées de 5 000 FCFA automatiquement appliquées en choisissant l'offre intégrale !
          </p>
        </div>

        <ServiceCalculator 
          services={SERVICES}
          selectedServiceIds={selectedServiceIds}
          onToggleService={handleToggleService}
        />
      </section>

      {/* FAQ Interactive Accordion Section */}
      <FAQSection />

      {/* Customer Trust Review List */}
      <section id="testimonials" className="bg-white py-16 border-t border-gray-150 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ReviewList />
        </div>
      </section>

      {/* Guarantee Badge Area */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white py-12 px-4 shadow-inner text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-block p-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30 font-bold text-xs uppercase tracking-widest mb-2">⚡ Certifié Fiable & Professionnel</span>
          <h3 className="font-display font-extrabold text-xl sm:text-2xl">La Garantie Richard Services</h3>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto">
            Chez Richard Services, notre signature est la rapidité, la pédagogie, et l'accompagnement continu. Nos élèves et clients continuent tous d'être guidés après nos formations pour lever les obstacles techniques !
          </p>
        </div>
      </section>

      {/* Footer / Contact info */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 border-t border-slate-900 text-xs text-center">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-display font-black text-sm tracking-tighter">
                R12
              </div>
              <span className="font-display font-black text-sm tracking-tight text-white block">RICHARD SERVICES</span>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-[11px]">
              <a href="#services-view" className="hover:text-white transition-colors">Solutions</a>
              <a href="#calculator-section" className="hover:text-white transition-colors">Calculateur</a>
              <a href="#faq-section" className="hover:text-white transition-colors">FAQ</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Témoignements</a>
              <button onClick={() => setShowExitConfirm(true)} className="text-red-400 hover:text-red-300 transition-colors">Quitter le site</button>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="leading-relaxed text-[11px] text-slate-500">
              Avertissement : Les marques déposées TikTok et PayPal appartiennent à leurs propriétaires respectifs. Richard Services n'est pas affilié à ByteDance Ltd. ou PayPal Holdings Inc. Les formations dispensées décrivent l'adaptation d'usages réglementaires et légaux pour les résidents des pays d'Afrique.
            </p>
            <p className="text-slate-500">
              © 2026 Richard Services. Tous droits réservés. Développé avec excellence pour propulser votre croissance.
            </p>
          </div>
        </div>
      </footer>

      {/* Modern, non-obtrusive, highly-automated floating support assistant */}
      <FloatingAssistant />

    </div>
  );
}
