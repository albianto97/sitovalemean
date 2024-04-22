export class ChatUser{
  username: string;
  newMessages: boolean;

  constructor( username: string, newMessages: boolean ) {
    this.newMessages = newMessages;
    this.username = username;
  }
}
