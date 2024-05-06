import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from "../../services/socket.service";
import { ChatUser } from "../../models/chatUser";
import { AuthService } from "../../services/auth.service";
import { ChatService } from "../../services/chat.service";
import { ChatMessage } from "../../models/chatMessage";
import { Observable } from "rxjs";

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  sender: any;
  receiver: any;
  messages: ChatMessage[] = [];
  message: string = '';
  currentUser: string = '';
  users: ChatUser[] = [];
  displayMessages: ChatMessage[] = [];
  newMessage: boolean = false;
  showBox: boolean = false;
  @Input() isAdmin: boolean = false;
  userId: any = '';

  constructor(private socketService: SocketService, private authService: AuthService, private chatService: ChatService) {
    socketService.registerChatHandlers((event: any, data: any) => this.socketCallback(event, data))
  }

  ngOnInit() {
    if (!this.isAdmin) {
      this.currentUser = "admin";
    }
    this.userId = this.authService.getUserFromToken();
    this.getChatForUser(this.userId._id);

  }

  getChatForUser(userId: string) {
    this.chatService.getMessagesForUser(userId)
      .subscribe((chat: any) => {
        this.sender = chat.sender;
        this.receiver = chat.receiver;
        this.messages = chat.messages;
        this.users= this.receiver.map((r: any) => Object.assign({}, { username: r.username, newMessages: false }))
        if(this.users.length > 0)
          this.currentUser = this.users[0].username;
        this.filterMessages();
      })
  }

  sendMessage() {
    if (this.message) {
      let messageItem: { from: string; to: string; content: string } = { to: this.currentUser, content: this.message, from: "" };
      this.socketService.sendMessage(messageItem);
      let chatMessage: ChatMessage = {
        from: this.sender,
        to: this.findCurrent(),
        content: this.message
      }
      this.messages.push(chatMessage);
      this.filterMessages();
      this.message = '';
    }
  }

  findCurrent() {
    return this.receiver.find((r:any) => r.username === this.currentUser);
  }

  socketCallback(event: any, data: any) {
    if (event == 'newMessage') {
      //if (this.isAdmin) {
        if (this.users.length == 0) {
          this.currentUser = data.from.username;
        }
        if (!this.users.some(u => u.username === data.from.username)) {
          this.users.push({ username: data.from.username, newMessages: this.users.length > 0 });
        } else {
          let user = this.users.find(u => u.username === data.from.username);
          if (user) {
            user.newMessages = data.from.username != this.currentUser;
          }
        }
      //}
        this.messages.push(data);
        console.log(this.messages);
        this.filterMessages();
    }else if(event == 'chatDeleted'){
      this.messages = [];
      this.filterMessages();
    }
  }

  filterMessages() {
    this.displayMessages = this.messages.filter((m: ChatMessage) => m.to.username == this.currentUser || m.from.username == this.currentUser);

    if (this.users.length > 0) {
      const currentUser = this.users.find(u => u.username === this.currentUser);
      if (currentUser) {
        console.log(this.currentUser + " utente corrente");
        currentUser.newMessages = false;
      }
    }

    this.newMessage = this.users.some(u => u.newMessages);
  }

  deleteMessage() {
    let deleteUsername: string  = this.currentUser;
    /*if (this.receiver) {
      deleteId = this.receiver[0]._id;*/
      if (deleteUsername) {
        this.chatService.deleteMessage(deleteUsername)
          .subscribe(() => {
            //eliminare dalla lista degli utenti attivi
            this.users = this.users.filter(user => user.username !== deleteUsername);
            // Trova il primo utente nell'array this.users
            const firstUser = this.users.find(() => true);
            // Assegna il nome utente corrispondente o '' se non trovato
            this.currentUser = firstUser ? firstUser.username : '';
            // Ricarica i messaggi mostrati solo se il messaggio è stato eliminato con successo
            this.filterMessages();

          });
    } else {
      console.error('Messaggio non definito correttamente');
    }
  }

}
