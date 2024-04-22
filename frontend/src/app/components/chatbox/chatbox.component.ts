import {Component, Input} from '@angular/core';
import {SocketService} from "../../services/socket.service";
import {ChatUser} from "../../models/chatUser";

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent {

  messages: any[] = [];
  message: string = '';
  currentUser: string = '';
  users: ChatUser[] = [];
  displayMessages: any[] = [];
  newMessage: boolean = false;
  showBox: boolean = true;
  @Input() isAdmin: boolean = false;

  constructor(private socketService: SocketService) {
    socketService.registerChatHandlers((event: any, data: any) =>this.socketCallback(event,data))
  }
  ngOnInit(){
    if(!this.isAdmin){
      this.currentUser = "admin";
    }
  }

  sendMessage() {
    if(this.message) {
      console.log(this.message);
      let messageItem = {"to": this.currentUser, "message": this.message, "from": ""};
      this.messages.push(messageItem);
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
        if (this.users.filter(u => u.username == data.from).length == 0) {
          this.users.push({username: data.from, newMessages: this.users.length > 0});
        }else {
          let user = this.users.filter(u => u.username == data.from)[0];
          user.newMessages = data.from != this.currentUser;
        }
      }

      this.messages.push(data);
      this.filterMessages();
    }
  }
  filterMessages(){
    this.displayMessages = this.messages.filter((m:any) => m.to == this.currentUser || m.from == this.currentUser);
    this.users.filter(u => u.username == this.currentUser)[0].newMessages = false;
    this.newMessage = this.users.filter(u => u.newMessages).length > 0; //u.newMessages ==true
  }
}
