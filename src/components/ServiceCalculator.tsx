import React, { useState } from "react";
import { Service } from "../types";
import { Calculator, MessageSquare, Percent, Sparkles, CheckCircle2 } from "lucide-react";

interface ServiceCalculatorProps {
  services: Service[];
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
}

export default function ServiceCalculator({ services, selectedServiceIds, onToggleService }: ServiceCalculatorProps) {
  const [clientName, setClientName] = useState("");
  const [clientCountry, setClientCountry] = useState("Côte d'Ivoire");
  const [clientNotes, setClientNotes] = useState("");

  const originalTotal = services
    .filter((s) => selectedServiceIds.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  // If all 4 services are selected, apply the special Mega Bundle Discount! Price is exactly 12,000 FCFA instead of 17,000 FCFA.
  const isMegaBundle = selectedServiceIds.length === services.length && services.length > 0;
  const discountedTotal = isMegaBundle ? 12000 : originalTotal;
  const savings = originalTotal - discountedTotal;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServiceIds.length === 0) {
      alert("Veuillez sélectionner au moins un service pour continuer !");
      return;
    }

    const selectedTitles = services
      .filter((s) => selectedServiceIds.includes(s.id))
      .map((s) => `• ${s.title} (${s.price.toLocaleString("fr-FR")} FCFA)`)
      .join("\n");

    const bundleStatus = isMegaBundle ? "🎁 PACK MEGA BUNDLE COMPLET (Tarif spécial : 12 000 FCFA)" : `Total : ${discountedTotal.toLocaleString("fr-FR")} FCFA`;

    const requestText = `Bonjour Richard Services, je m'appelle ${clientName || "un visiteur"} depuis ${clientCountry}.

Je souhaite commander les services en ligne suivants :
${selectedTitles}

${isMegaBundle ? `🎉 ÉCONOMIE : -${savings.toLocaleString("fr-FR")} FCFA !` : ""}
💰 Montant Total estimé : ${discountedTotal.toLocaleString("fr-FR")} FCFA

${clientNotes ? `📝 Notes complémentaires : ${clientNotes}\n` : ""}
Pouvez-vous me recontacter pour lancer mon accompagnement ? Merci !`;

    const encodedText = encodeURIComponent(requestText);
    const whatsappUrl = `https://wa.me/2250576075614?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div id="calculator-section" className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-2xl text-blue-950">Calculateur d'Accompagnement</h2>
          <p className="text-sm text-gray-500">Sélectionnez et configurez vos modules sur-mesure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Choices selection Column */}
        <div className="lg:col-span-7 space-y-4">
          <label className="block text-sm font-bold text-blue-950 mb-1">
            Étape 1 : Cochez les services dont vous avez besoin :
          </label>
          <div className="space-y-3">
            {services.map((service) => {
              const isChecked = selectedServiceIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => onToggleService(service.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    isChecked
                      ? "border-blue-600 bg-blue-50/40"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Swallowing so parent onClick works cleanly
                    className="w-5 h-5 mt-0.5 Accent-blue-600 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-blue-950">{service.title}</span>
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {service.price.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-lg">{service.problem}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Golden Bundle Prompt */}
          <div className={`p-4 rounded-2xl transition-all border ${
            isMegaBundle 
              ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-900 shadow-sm"
              : "bg-gray-50 border-gray-100 text-gray-500"
          }`}>
            <div className="flex gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${isMegaBundle ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-400"}`}>
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm block">💡 Offre Combo Extrême : pack 4-en-1 !</span>
                <p className="text-xs mt-0.5 leading-relaxed">
                  Activez la totalité des 4 modules d'accompagnement (TikTok, PayPal, WhatsApp & Marketing) pour seulement <strong className="text-amber-800">12 000 FCFA</strong> (au lieu de 17 000 FCFA), économisant instantanément <strong className="text-amber-800">5 000 FCFA</strong> !
                </p>
                {!isMegaBundle && (
                  <button 
                    onClick={() => {
                      // Select all 4
                      services.forEach(s => {
                        if (!selectedServiceIds.includes(s.id)) onToggleService(s.id);
                      });
                    }}
                    className="text-xs text-blue-600 font-bold hover:underline mt-2 flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <Sparkles className="w-3 h-3" /> Activer le pack Mega Bundle maintenant !
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form and Pricing Summary Column */}
        <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
          <form onSubmit={handleSendWhatsApp} className="space-y-4">
            <label className="block text-sm font-bold text-blue-950">
              Étape 2 : Vos coordonnées pour Richard :
            </label>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Votre Nom & Prénom</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex : Koffi Kouassi"
                className="w-full bg-white border border-gray-200 focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Votre Pays / Ville</label>
              <input
                type="text"
                required
                value={clientCountry}
                onChange={(e) => setClientCountry(e.target.value)}
                placeholder="Ex : Abidjan, Côte d'Ivoire"
                className="w-full bg-white border border-gray-200 focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Détails ou questions spécifiques (Optionnel)</label>
              <textarea
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="Ex: J'aimerais créer mon PayPal ce soir et connecter ma carte UBA."
                rows={3}
                className="w-full bg-white border border-gray-200 focus:border-blue-500 px-3.5 py-2 rounded-xl text-sm outline-none resize-none transition-colors"
              />
            </div>

            {/* Calculations block */}
            <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Services cumulés ({selectedServiceIds.length}) :</span>
                <span className={isMegaBundle ? "line-through text-xs" : ""}>{originalTotal.toLocaleString("fr-FR")} FCFA</span>
              </div>

              {isMegaBundle && (
                <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg text-xs">
                  <span>Remise Promo Pack complet :</span>
                  <span>-{savings.toLocaleString("fr-FR")} FCFA</span>
                </div>
              )}

              <div className="flex justify-between items-end pt-2 border-t border-dashed border-gray-200">
                <span className="font-bold text-blue-950">Total Final :</span>
                <span className="text-xl font-display font-extrabold text-blue-950">
                  {discountedTotal.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={selectedServiceIds.length === 0}
              className={`w-full flex items-center justify-center gap-2 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-md ${
                selectedServiceIds.length === 0
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-[#25D366] hover:bg-[#128C7E] shadow-[#25D366]/20 hover:scale-[1.01] active:translate-y-0.5"
              }`}
            >
              <MessageSquare className="w-5 h-5 shrink-0" />
              Envoyer ma commande WhatsApp
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-2">
              Un message pré-configuré s'ouvrira directement sur WhatsApp. Vous pourrez le relire avant l'envoi.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
