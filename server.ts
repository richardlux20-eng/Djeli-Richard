import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the GoogleGenAI instance with the server-side API key.
// It will gracefully warn if the key is missing rather than crashing the process,
// so the user experience doesn't hang forever.
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. AI Consultation features will show a fallback.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper function for local smart fallback responses when API is unavailable
  const getLocalFallbackResponse = (messages: any[]): string => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user" || m.role === "customer")?.content || "";
    
    const textLower = lastUserMessage.toLowerCase();
    
    if (textLower.includes("tiktok") || textLower.includes("tik tok") || textLower.includes("monet") || textLower.includes("monétis") || textLower.includes("gagn")) {
      return `🎬 **Monétisation TikTok & Configuration Éligible**\n\nRichard Services s'occupe de la configuration complète de votre compte TikTok pour activer la monétisation en toute sécurité, même dans les pays ou zones non éligibles (Afrique).\n\nNous vous accompagnons également pas-à-pas pour lier vos configurations de retrait et recevoir vos fonds sereinement.\n\n⚡ **Tarif unique** : 5 000 FCFA.\n👉 Pour lancer cette configuration immédiatement, cliquez sur le bouton de discussion WhatsApp !`;
    }
    
    if (textLower.includes("paypal") || textLower.includes("pay pal") || textLower.includes("retrait") || textLower.includes("recev")) {
      return `💳 **Compte PayPal 100% Vérifié & Sécurisé**\n\nOui, notre formation et notre accompagnement spécial vous enseignent comment configurer un compte PayPal récepteur et émetteur entièrement validé depuis l'Afrique sans aucun risque de blocage.\n\nDe plus, nous vous formons sur les passerelles pour retirer votre solde directement sous 15 minutes sur votre compte Orange Money, MTN, Moov, Wave, etc.\n\n⚡ **Tarif unique** : 4 000 FCFA.\n👉 Écrivez à Richard sur WhatsApp pour démarrer maintenant !`;
    }
    
    if (textLower.includes("tunnel") || textLower.includes("vente") || textLower.includes("automat") || textLower.includes("whatsapp")) {
      return `📱 **WhatsApp Business & Tunnel de Vente Gratuit**\n\nC'est l'outil indispensable pour accueillir, qualifier et convertir automatiquement vos prospects en clients payants sans investir d'argent dans la publicité ou des abonnements logiciels complexes !\n\nNous vous aidons à configurer l'ensemble du système d'automatisation professionnelle.\n\n⚡ **Tarif unique** : 3 000 FCFA.\n👉 Prêt à propulser vos ventes ? Contactez Richard sur WhatsApp !`;
    }

    if (textLower.includes("tarif") || textLower.includes("prix") || textLower.includes("combien") || textLower.includes("coût") || textLower.includes("offre") || textLower.includes("redu") || textLower.includes("promo") || textLower.includes("pack") || textLower.includes("combo")) {
      return `💰 **Tarifs & Offres de Richard Services**\n\nVoici le détail de nos solutions individuelles :\n- 🎬 **Monétisation TikTok** : 5 000 FCFA\n- 💳 **Compte PayPal Vérifié** : 4 000 FCFA\n- 📱 **Tunnel de Vente WhatsApp** : 3 000 FCFA\n- 📈 **Marketing Digital Complet** : 5 000 FCFA\n\n🎁 **FORFAIT MEGA COMBO (Recommandé !)**\nCumulez l'intégralité des 4 modules de formation pour seulement **12 000 FCFA** au lieu de 17 000 FCFA, vous économisez immédiatement 5 000 FCFA !\n\n👉 Intéressé ? Vous pouvez utiliser le calculateur de services sur notre site ou lancer l'accompagnement d'un clic via WhatsApp !`;
    }

    if (textLower.includes("bonjour") || textLower.includes("salut") || textLower.includes("hello") || textLower.includes("coucou") || textLower.includes("cc")) {
      return `👋 **Bienvenue chez Richard Services !**\n\nJe suis votre assistant virtuel intelligent ⚡\n\nJe suis là pour vous conseiller sur nos grands axes d'accompagnements numériques :\n1. 🎬 **Idées & Monétisation TikTok** (5 000 FCFA)\n2. 💳 **Compte PayPal fonctionnel en Afrique** (4 000 FCFA)\n3. 📱 **Tunnels de vente automatiques & de confiance** (3 000 FCFA)\n4. 📈 **Marketing et Réseaux Sociaux** (5 000 FCFA)\n\nQue préférez-vous aborder pour lancer votre projet ? Vous pouvez aussi me poser n'importe quelle question !`;
    }

    // Default polite comprehensive fallback
    return `⚡ **Richard Services est à votre écoute !**\n\nNous vous formons et vous guidons de A à Z pour surmonter toutes les pannes et blocages de monétisation, de comptes PayPal, ou d'automatisation de vente en Afrique.\n\nPour une réponse personnalisée et ultra-rapide par rapport à votre message, nous vous suggérons d'échanger en direct avec Richard directement sur WhatsApp (réponse sous quelques minutes !).\n\nÀ tout de suite ! 😊`;
  };

  // API endpoints go here FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Format de message invalide. Un tableau de messages est requis." });
      }

      if (!ai) {
        console.info("ℹ️ INFO: No Gemini API Key configured. Responding with virtual smart fallback generator.");
        const localReply = getLocalFallbackResponse(messages);
        return res.json({ content: localReply });
      }

      // Convert messages to Gemini's expected Content format and ensure it conforms to API standards:
      // 1. Must strictly alternate: user -> model -> user -> model.
      // 2. Must start with a 'user' turn.
      // 3. Filter out empty message strings.
      let tempContents = messages
        .map((msg: any) => {
          const role = msg.role === "assistant" ? "model" : "user";
          return {
            role,
            parts: [{ text: msg.content || "" }]
          };
        })
        .filter((item: any) => item.parts[0].text.trim() !== "");

      // Trim any leading model (assistant) turns to ensure the chat starts with the user
      while (tempContents.length > 0 && tempContents[0].role !== "user") {
        tempContents.shift();
      }

      // Enforce strict alternating sequence (user -> model -> user -> model)
      const formattedContents: any[] = [];
      let expectedRole = "user";
      for (const item of tempContents) {
        if (item.role === expectedRole) {
          formattedContents.push(item);
          expectedRole = expectedRole === "user" ? "model" : "user";
        } else if (formattedContents.length > 0 && item.role === "user" && expectedRole === "model") {
          // If we encounter two user messages in a row, let's append the text contents to the last user message
          const lastItem = formattedContents[formattedContents.length - 1];
          if (lastItem && lastItem.parts && lastItem.parts[0]) {
            lastItem.parts[0].text += "\n" + item.parts[0].text;
          }
        } else if (formattedContents.length > 0 && item.role === "model" && expectedRole === "user") {
          // If we encounter two model messages in a row, let's append the text contents to the last model message
          const lastItem = formattedContents[formattedContents.length - 1];
          if (lastItem && lastItem.parts && lastItem.parts[0]) {
            lastItem.parts[0].text += "\n" + item.parts[0].text;
          }
        }
      }

      // Fallback if everything was filtered out
      if (formattedContents.length === 0) {
        formattedContents.push({
          role: "user",
          parts: [{ text: "Bonjour !" }]
        });
      }

      const systemInstruction = `
Vous êtes "Richard Services AI Assistant", l'assistant virtuel intelligent officiel de RICHARD V12 SERVICES (fondé par Richard, un expert d'accompagnement digital basé en Côte d'Ivoire).
Votre but est d'accueillir chaleureusement les visiteurs du site, de répondre à leurs questions sur nos services numériques, de les rassurer et de les aider à choisir l'offre idéale.

Voici les services clés que nous proposons avec leurs explications et tarifs :
1. Monétisation TikTok (Tarif: 5 000 FCFA)
   - Problème résolu: Comptes TikTok bloqués, inéligibles à la monétisation en Afrique, ou impossibilité de retirer l'argent accumulé.
   - Notre solution: Création de comptes TikTok monétisables (basés en Europe/USA) et guides/formations pour retirer l'argent facilement vers Orange money, MTN, Moov ou Wave via PayPal/intermédiaires.

2. Création de Comptes PayPal Vérifiés (Tarif: 4 000 FCFA)
   - Problème résolu: PayPal est restreint ou non fonctionnel dans de nombreux pays d'Afrique de l'Ouest (envoi seul, réception bloquée).
   - Notre solution: Formation complète pas-à-pas et assistance pour créer, configurer et posséder un compte PayPal 100% vérifié et fonctionnel capable de recevoir et d'envoyer de l'argent depuis l'Afrique sans risque de blocage.

3. Formation WhatsApp Business & Tunnel de Vente (Tarif: 3 000 FCFA)
   - Problème résolu: Difficulté à automatiser la relation client, absence de catalogue professionnel, et manque de stratégie de vente organique.
   - Notre solution: Automatisation professionnelle, messages d'accueil/absence intelligents, création d'un tunnel de vente automatique et 100% gratuit pour attirer, qualifier et convertir les clients.

4. Marketing Digital & Réseaux Sociaux (Tarif: 5 000 FCFA)
   - Problème résolu: Manque de visibilité, pas de ventes de produits ou de services, mauvaise gestion des réseaux.
   - Notre solution: Formations et coaching personnalisé pour structurer Instagram, Facebook, TikTok pour le business, faire des visuels attrayants et attirer des clients qualifiés chaque jour.

Offre groupée spéciale (Pack Mega Bundle) :
- Les 4 services et formations à seulement 12 000 FCFA au lieu de 17 000 FCFA (soit une économie de 5 000 FCFA !). Très recommandé pour lancer son activité en ligne.

Ton de communication :
- S'exprimer en français.
- Être extrêmement poli, enthousiaste, professionnel, et rassurant (ex: "⚡ Service rapide, professionnel et fiable").
- Adapter les réponses de manière concise et facile à lire avec des emojis business.
- Si le client hésite ou souhaite aller plus loin, lui suggérer d'utiliser le calculateur de services ou de cliquer sur le bouton WhatsApp pour commander directement avec Richard.
- Ne jamais inventer d'autres tarifs ou de fausses informations non mentionnées ici.

Répondez de manière structurée et attrayante.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Je n'ai pas pu générer de réponse. N'hésitez pas à nous écrire sur WhatsApp !";
      return res.json({ content: replyText });
    } catch (error: any) {
      console.warn("⚠️ Error with Gemini API, falling back to local responder:", error);
      const fallbackReply = getLocalFallbackResponse(req.body.messages || []);
      return res.json({ content: fallbackReply });
    }
  });

  // Health and verification endpoints to debug and guarantee API presence
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Express server is healthy and responding!" });
  });

  app.get("/api/chat", (req, res) => {
    res.json({
      status: "ready",
      message: "API endpoint is functional. Send clear POST requests to interact with Richard Services AI Assistant."
    });
  });

  // Custom JSON-only error handler for Express to prevent HTML output during JSON parsing or routing issues
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Express Error Handler caught:", err);
    res.status(err.status || 500).json({
      error: err.message || "Une erreur interne de communication est survenue.",
    });
  });

  // Configure Vite or Serve Static Production files
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    // Dynamic import to avoid loading Vite package in prod
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted synchronously.");
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Richard Services local server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
