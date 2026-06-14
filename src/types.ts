export interface Service {
  id: string;
  title: string;
  problem: string;
  solution: string;
  longDescription: string;
  price: number;
  badge?: string;
  whatsAppText: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
