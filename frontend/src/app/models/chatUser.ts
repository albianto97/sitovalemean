export class ChatUser{
  username: string;
  newMessages: boolean;
  date?: Date;

  constructor( username: string, newMessages: boolean, date: Date) {
    this.newMessages = newMessages;
    this.username = username;
    this.date = date;
  }
}
