import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from "../../services/socket.service";
import { ChatUser } from "../../models/chatUser";
import { AuthService } from "../../services/auth.service";
import { ChatService } from "../../services/chat.service";
import { ChatMessage } from "../../models/chatMessage";

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  sender: any;
  receiver: any;
  chatIconActive: boolean = false;
  messages: ChatMessage[] = [];
  message: string = '';
  destinatario: string = '';
  listaDestinatari: ChatUser[] = [];
  displayMessages: ChatMessage[] = [];
  newMessage: boolean = false;
  showBox: boolean = false;
  onlineFilter: boolean = false;
  @Input() isAdmin: boolean = false;
  mittente: any;
  allUsers: any[] = [];

  constructor(private socketService: SocketService, private authService: AuthService, private chatService: ChatService) {
    socketService.registerChatHandlers((event: any, data: any) => this.socketCallback(event, data))
  }

  ngOnInit() {
    if (!this.isAdmin) {
      this.destinatario = "admin";
    } else {
      this.destinatario = "Cliente"
    }
    this.mittente = this.authService.getUserFromToken();
    this.getChatForUser();
  }

  getChatForUser() {
    this.chatService.getMessagesForUser(this.mittente._id, this.onlineFilter)
      .subscribe((chat: any) => {
        console.log(chat);

        this.sender = chat.sender;
        this.receiver = chat.receiver;
        this.messages = chat.messages;
        this.listaDestinatari = this.receiver.map((r: any) => Object.assign({}, { username: r.username, newMessages: false }))
        if (!this.isAdmin) {
          this.destinatario = "amministrazione";
        } else {
          if (this.listaDestinatari.length > 0)
            this.destinatario = this.listaDestinatari[0].username;
          else
            this.destinatario = '';
        }

        let usersWithNewMessages = chat.usersWithNewMessages;
        for (let i = 0; i < usersWithNewMessages.length; i++) {
          let username = usersWithNewMessages[i];
          let foundUser = this.listaDestinatari.filter(u => u.username == username);
          if (foundUser.length > 0)
            foundUser[0].newMessages = true;
        }
        this.filterMessages();
      })
  }

  sendMessage() {
    console.log(this.listaDestinatari);

    if (this.message) {
      let messageItem: { from: string; to: string; content: string } = { to: this.destinatario, content: this.message, from: this.sender.username };
      if (this.destinatario == 'amministrazione') {
        this.listaDestinatari.forEach(dest => {
          messageItem.to = dest.username;
          this.socketService.sendMessage(messageItem);
        })
      } else {
        // messageItem.from = 'amministrazione'
        this.socketService.sendMessage(messageItem);
      }
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

  findCurrent(): any {
    return this.listaDestinatari.find((r: any) => r.username === this.destinatario);
  }

  socketCallback(event: any, data: any) {
    console.log(event, this.showBox);

    if (event == 'newMessage') {
      this.chatIconActive = !this.showBox;
      //if (this.isAdmin) {
        if(this.isAdmin && data.from.username == 'amministrazione'){
          this.getChatForUser();
        }else{          
          if (this.listaDestinatari.length == 0) {
            this.destinatario = data.from.username;    
          }
          if (!this.listaDestinatari.some(u => u.username === data.from.username)) {
            console.log(this.listaDestinatari.length);
    
            this.listaDestinatari.push({ username: data.from.username, newMessages: true });
          } else {
            let user = this.listaDestinatari.find(u => u.username === data.from.username);
            if (user) {
              user.newMessages = !this.showBox || data.from.username != this.destinatario;
            }
          }
          //}
          this.messages.push(data);
          console.log(this.messages);
        }

    } else if (event == 'chatDeleted') {
      this.messages = []; // cancellare la chat post delete
      this.messages.push({ to: this.sender, from: { 'username': "_service_" }, content: "admin ha eliminato la chat" });
    }
    this.filterMessages();
  }

  filterMessages() {
    this.displayMessages = this.messages.filter((m: ChatMessage) => m.to.username == this.destinatario || m.from.username == this.destinatario || m.from.username == '_service_');
    if (this.listaDestinatari.length > 0 && this.showBox) {
      const destinatario = this.listaDestinatari.find(u => u.username === this.destinatario);
      if (destinatario) {
        console.log(this.destinatario + " utente corrente");
        destinatario.newMessages = false;
        this.socketService.notifyChatDisplayed(this.mittente.username, this.destinatario)
      }
    }

    this.newMessage = this.listaDestinatari.some(u => u.newMessages);
    console.log(this.listaDestinatari.some(u => u.newMessages));

    this.chatIconActive = this.newMessage;
  }

  deleteMessage() {
    let deleteUsername: string = this.destinatario;
    /*if (this.receiver) {
      deleteId = this.receiver[0]._id;*/
    if (deleteUsername) {
      this.chatService.deleteMessage(deleteUsername)
        .subscribe(() => {
          //eliminare dalla lista degli utenti attivi
          this.listaDestinatari = this.listaDestinatari.filter(user => user.username !== deleteUsername);
          // Trova il primo utente nell'array this.listaDestinatari
          const firstUser = this.listaDestinatari.find(() => true);
          // Assegna il nome utente corrispondente o '' se non trovato
          this.destinatario = firstUser ? firstUser.username : '';
          // Ricarica i messaggi mostrati solo se il messaggio è stato eliminato con successo
          this.messages = this.messages.filter(messagge => messagge.from.username != deleteUsername && messagge.to.username != deleteUsername);
          this.filterMessages();
        });
    } else {
      console.error('Impossibile determinare l\'ID del destinatario per eliminare il messaggio');
    }
  }

  closeBox() {
    this.showBox = false;
    this.chatIconActive = this.newMessage;
  }

  displayBox() {
    this.showBox = true;
    this.filterMessages();
  }

  updateFilterOnline() {
    setTimeout(() => this.getChatForUser());
  }
}
