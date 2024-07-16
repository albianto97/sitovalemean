// Importazioni necessarie per il componente
import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from "../../services/socket.service";
import { ChatUser } from "../../models/chatUser";
import { AuthService } from "../../services/auth.service";
import { ChatService } from "../../services/chat.service";
import { ChatMessage } from "../../models/chatMessage";

// Definizione del componente con selettore, template e stile associati
@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  // Variabili per gestire lo stato e i dati della chat
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

  // Costruttore con i servizi necessari e registrazione dei gestori dei socket
  constructor(private socketService: SocketService, private authService: AuthService, private chatService: ChatService) {
    socketService.registerChatHandlers((event: any, data: any) => this.socketCallback(event, data))
  }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit() {
    if (!this.isAdmin) {
      this.destinatario = "admin";
    } else {
      this.destinatario = "Cliente";
    }
    this.mittente = this.authService.getUserFromToken();
    this.getChatForUser();
  }

  // Metodo per ottenere le chat dell'utente
  getChatForUser() {
    this.chatService.getMessagesForUser(this.mittente._id, this.onlineFilter)
      .subscribe(
        (chat: any) => {
          this.sender = chat.sender;
          this.receiver = chat.receiver;
          this.messages = chat.messages;
          this.listaDestinatari = this.receiver.map((r: any) => Object.assign({}, { username: r.username, newMessages: false }));
          if (!this.isAdmin) {
            this.destinatario = "amministrazione";
          } else {
            if (this.listaDestinatari.length > 0) {
              this.destinatario = this.listaDestinatari[0].username;
            } else {
              this.destinatario = '';
            }
          }

          // Segna gli utenti con nuovi messaggi
          let usersWithNewMessages = chat.usersWithNewMessages;
          for (let i = 0; i < usersWithNewMessages.length; i++) {
            let username = usersWithNewMessages[i];
            let foundUser = this.listaDestinatari.filter(u => u.username == username);
            if (foundUser.length > 0) {
              foundUser[0].newMessages = true;
            }
          }
          this.filterMessages();
        },
        (error: any) => {
          console.error('Errore durante il recupero dei messaggi:', error);
        }
      );
  }

  // Metodo per inviare un messaggio
  sendMessage() {
    if (this.message) {
      let messageItem: { from: string; to: string; content: string } = { to: this.destinatario, content: this.message, from: this.sender.username };
      if (this.destinatario == 'amministrazione') {
        this.listaDestinatari.forEach(dest => {
          messageItem.to = dest.username;
          this.socketService.sendMessage(messageItem);
        });
      } else {
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

  // Metodo per trovare il destinatario corrente
  findCurrent(): any {
    return this.listaDestinatari.find((r: any) => r.username === this.destinatario);
  }

  // Callback per gestire gli eventi dei socket
  socketCallback(event: any, data: any) {
    if (event == 'newMessage') {
      this.chatIconActive = !this.showBox;
      if(this.isAdmin && data.from.username == 'amministrazione'){
        this.getChatForUser();
      } else {          
        if (this.listaDestinatari.length == 0) {
          this.destinatario = data.from.username;    
        }
        if (!this.listaDestinatari.some(u => u.username === data.from.username)) {
          this.listaDestinatari.push({ username: data.from.username, newMessages: true });
        } else {
          let user = this.listaDestinatari.find(u => u.username === data.from.username);
          if (user) {
            user.newMessages = !this.showBox || data.from.username != this.destinatario;
          }
        }
        this.messages.push(data);
      }
    } else if (event == 'chatDeleted') {
      this.messages = []; // Cancellare la chat post delete
      this.messages.push({ to: this.sender, from: { 'username': "_service_" }, content: "admin ha eliminato la chat" });
    }
    this.filterMessages();
  }

  // Metodo per filtrare i messaggi visualizzati
  filterMessages() {
    this.displayMessages = this.messages.filter((m: ChatMessage) => m.to.username == this.destinatario || m.from.username == this.destinatario || m.from.username == '_service_');
    if (this.listaDestinatari.length > 0 && this.showBox) {
      const destinatario = this.listaDestinatari.find(u => u.username === this.destinatario);
      if (destinatario) {
        destinatario.newMessages = false;
        this.socketService.notifyChatDisplayed(this.mittente.username, this.destinatario);
      }
    }
    this.newMessage = this.listaDestinatari.some(u => u.newMessages);
    this.chatIconActive = this.newMessage;
  }

  // Metodo per eliminare un messaggio
  deleteMessage() {
    let deleteUsername: string = this.destinatario;
    if (deleteUsername) {
      this.chatService.deleteMessage(deleteUsername)
        .subscribe(
          () => {
            this.listaDestinatari = this.listaDestinatari.filter(user => user.username !== deleteUsername);
            const firstUser = this.listaDestinatari.find(() => true);
            this.destinatario = firstUser ? firstUser.username : '';
            this.messages = this.messages.filter(messagge => messagge.from.username != deleteUsername && messagge.to.username != deleteUsername);
            this.filterMessages();
          },
          (error: any) => {
            console.error('Errore durante l\'eliminazione del messaggio:', error);
          }
        );
    } else {
      console.error('Impossibile determinare l\'ID del destinatario per eliminare il messaggio');
    }
  }

  // Metodo per chiudere la finestra della chat
  closeBox() {
    this.showBox = false;
    this.chatIconActive = this.newMessage;
  }

  // Metodo per mostrare la finestra della chat
  displayBox() {
    this.showBox = true;
    this.filterMessages();
  }

  // Metodo per aggiornare il filtro online
  updateFilterOnline() {
    setTimeout(() => this.getChatForUser());
  }
}
