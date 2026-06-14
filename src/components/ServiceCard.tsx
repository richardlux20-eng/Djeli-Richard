import React, { useState } from "react";
import { Service } from "../types";
import { CheckCircle, AlertTriangle, MessageSquare, ChevronDown, ChevronUp, Share2 } from "lucide-react";

interface ServiceCardProps {
  key?: string;
  service: Service;
  onSelect: (id: string) => void;
  isSelectedInCalculator: boolean;
  onWhatsAppOrder: (text: string) => void;
}

export default function ServiceCard({ service, onSelect, isSelectedInCalculator, onWhatsAppOrder }: ServiceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 bg-white ${
        isSelectedInCalculator 
          ? "border-blue-600 ring-2 ring-blue-600/10 shadow-lg" 
          : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
      }`}
      id={`service-${service.id}`}
    >
      {/* Top accent badge */}
      {service.badge && (
        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
          {service.badge}
        </span>
      )}

      <div className="p-6">
        <h3 className="font-display font-bold text-xl text-blue-950 mb-3 flex items-center gap-2">
          {service.title}
        </h3>

        {/* Problem block */}
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-3 text-red-900 text-sm">
          <div className="flex gap-2 items-start">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-red-700 block text-xs uppercase tracking-wider mb-0.5">Le Problème</span>
              <p>{service.problem}</p>
            </div>
          </div>
        </div>

        {/* Solution block */}
        <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-3 text-emerald-900 text-sm">
          <div className="flex gap-2 items-start">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-700 block text-xs uppercase tracking-wider mb-0.5">Notre Solution</span>
              <p>{service.solution}</p>
            </div>
          </div>
        </div>

        {/* Simple details dropdown */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 mb-5 transition-colors"
        >
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {isOpen ? "Masquer les détails" : "En savoir plus sur la méthode"}
        </button>

        {isOpen && (
          <div className="mb-6 text-sm text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-100 animate-fadeIn">
            <p className="leading-relaxed whitespace-pre-line">{service.longDescription}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-400">Tarif Unique</div>
            <div className="font-display font-extrabold text-lg text-blue-950">
              {service.price.toLocaleString("fr-FR")} FCFA
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSelect(service.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isSelectedInCalculator 
                  ? "bg-blue-50 text-blue-700 border-blue-200" 
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {isSelectedInCalculator ? "Ajouté" : "Ajouter au devis"}
            </button>

            <button
              onClick={() => onWhatsAppOrder(service.whatsAppText)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              Commander ce service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
