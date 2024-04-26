import {Component, Input} from '@angular/core';
import {SocketService} from "../../services/socket.service";
import {ChatUser} from "../../models/chatUser";
import {AuthService} from "../../services/auth.service";
import {ChatService} from "../../services/chat.service";
import {ChatMessage} from "../../models/chatMessage";
import {Observable} from "rxjs";

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent {

  messages: ChatMessage[] = [];
  message: string = '';
  currentUser: string = '';
  users: ChatUser[] = [];
  displayMessages: any[] = [];
  newMessage: boolean = false;
  showBox: boolean = false;
  @Input() isAdmin: boolean = false;
  private userId: any = '';

  constructor(private socketService: SocketService, private authService: AuthService, private chatService: ChatService) {
    socketService.registerChatHandlers((event: any, data: any) =>this.socketCallback(event,data))
  }
  ngOnInit(){
    if(!this.isAdmin){
      this.currentUser = "admin";
    }
    this.userId = this.authService.getUserFromToken();
    //this.messages = this.chatService.getMessagesForUser(this.userId._id);
    this.getChatForUser(this.userId._id);
    console.log("m1: " + this.messages);
  }

  getChatForUser(userId: string) {
    this.chatService.getMessagesForUser(userId)
      .subscribe((messages: ChatMessage[]) => {
        console.log("m1: " + messages);
        this.messages = messages;
        this.filterMessages();
      })
  }

  sendMessage() {
    if(this.message) {
      console.log(this.message);
      let messageItem = {"to": this.currentUser, "message": this.message, "from": ""};
      //salva nel backend --> frontend nulla da fare
      //this.messages.push(messageItem);
      //CONVERTIRE \n in <br>
      this.socketService.sendMessage(messageItem);
      this.filterMessages();
      this.message = '';
    }
  }
  socketCallback(event: any, data: any){
    if(event == 'newMessage'){
      if(this.isAdmin){
        if(this.users.length == 0){
          this.currentUser = data.from;
        }
        if(data.from != "admin")
        if (this.users.filter(u => u.username == data.from).length == 0 ) {
          this.users.push({username: data.from, newMessages: this.users.length > 0});
        }else{
          let user = this.users.filter(u => u.username == data.from)[0];
          user.newMessages = data.from != this.currentUser;
        }
      }
      //salva nel backend --> frontend nulla da fare
      //this.messages.push(messageItem);
      this.filterMessages();
    }
  }
  filterMessages() {
    this.displayMessages = this.messages.filter((m: ChatMessage) => m.to == this.currentUser || m.from == this.currentUser);

    if (this.users.length > 0) { // Verifichiamo che l'array degli utenti non sia vuoto
      const currentUserObj = this.users.find(u => u.username === this.currentUser);
      if (currentUserObj) {
        currentUserObj.newMessages = false; // Impostiamo newMessages per l'utente corrente a false
      }
    }

    this.newMessage = this.users.some(u => u.newMessages); // true se ci sono nuovi messaggi
  }

  /*filterMessages(){
    this.displayMessages = this.messages.filter((m:any) => m.to == this.currentUser || m.from == this.currentUser);
    this.users.filter(u => u.username == this.currentUser)[0].newMessages = false;
    this.newMessage = this.users.filter(u => u.newMessages).length > 0; //u.newMessages ==true
    console.log("m2: " + this.messages);
  }*/
}
