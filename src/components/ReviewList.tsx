import React, { useState, useEffect } from "react";
import { Review } from "../types";
import { Star, MessageSquare, Plus, UserCheck } from "lucide-react";

const INITIAL_REVIEWS: Review[] = [
  {
    id: "review-1",
    name: "Koffi Yao Bruno",
    rating: 5,
    comment: "Incroyable professionnalisme ! Mon compte TikTok créé pour l'Afrique a été parfaitement monétisé en 48h. Ma première paye a pu être retirée via PayPal vers Wave sans aucun blocage. Un grand merci à Richard !",
    service: "Monétisation TikTok & PayPal",
    date: "12 Avril 2026"
  },
  {
    id: "review-2",
    name: "Mariama Diallo",
    rating: 5,
    comment: "La formation de tunnel de vente sur WhatsApp Business a littéralement transformé ma boutique de prêt-à-porter en ligne à Dakar. Les messages automatiques font économiser des heures de travail et convertissent les prospects tout seul !",
    service: "Formation WhatsApp Business",
    date: "28 Mai 2026"
  },
  {
    id: "review-3",
    name: "Amadou Traoré",
    rating: 5,
    comment: "Je cherchais une formation marketing fiable en Afrique de l'Ouest depuis longtemps et je ne suis pas déçu. Richard explique clairement pas-à-pas et reste disponible ensuite pour du coaching personnalisé.",
    service: "Marketing Digital",
    date: "04 Juin 2026"
  }
];

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [service, setService] = useState("Monétisation TikTok");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("richard_services_reviews");
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem("richard_services_reviews", JSON.stringify(INITIAL_REVIEWS));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      service,
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem("richard_services_reviews", JSON.stringify(updated));

    // Reset Form
    setName("");
    setComment("");
    setRating(5);
    setShowForm(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-blue-950">Avis de nos Clients & Élèves</h2>
          <p className="text-sm text-gray-500">Découvrez les retours d'expérience authentiques de notre communauté</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97]"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {showForm ? "Masquer le formulaire" : "Laisser un avis"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-150 space-y-4 animate-fadeIn">
          <h3 className="font-display font-bold text-base text-blue-950">Partagez votre avis d'accompagnement</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Votre Nom & Prénom</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Moussa Diop"
                className="w-full bg-white border border-gray-200 focus:border-blue-500 px-3.5 py-2 rounded-xl text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Service Suivi</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-blue-500 px-3.5 py-2 rounded-xl text-sm outline-none"
              >
                <option value="Monétisation TikTok">Monétisation TikTok</option>
                <option value="Création de Compte PayPal">Création de Compte PayPal</option>
                <option value="Formation WhatsApp Business">Formation WhatsApp Business</option>
                <option value="Marketing Digital & Réseaux Sociaux">Marketing Digital</option>
                <option value="Pack complet V12">Pack complet V12</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Note de Satisfaction</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Votre commentaire (Authenticité requise)</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Décrivez votre expérience avec Richard Services..."
              className="w-full bg-white border border-gray-200 focus:border-blue-500 px-3.5 py-2 rounded-xl text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 active:scale-95"
          >
            Publier mon avis
          </button>
        </form>
      )}

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{r.date}</span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                "{r.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-gray-150">
              <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                {r.name.slice(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                  {r.name}
                  <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                </h4>
                <p className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded-full inline-block font-semibold">
                  {r.service}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
