export interface ChatMessage {
  _id?: string;
  from: {
    _id: string;
    username: string;
  };
  to: {
    _id: string;
    username: string;
  };
  content: string;
  timestamp?: Date;
  __v?: number;
}
