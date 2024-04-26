export interface ChatMessage {
  _id?: string;
  from: string;
  to: string;
  content: string; // Aggiungi questo campo
  timestamp?: Date;
}
