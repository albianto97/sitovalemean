export class ChatUser{
  username: string;
  newMessages: boolean;
  //date?: Date;

  constructor( username: string, newMessages: boolean) {
    this.username = username;
    this.newMessages = newMessages;
    //this.date = date;
  }
}
