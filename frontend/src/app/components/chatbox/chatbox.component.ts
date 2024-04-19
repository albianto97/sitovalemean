import {Component, Input} from '@angular/core';
import {SocketService} from "../../services/socket.service";

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent {

  messages: any[] = [];
  message: string = '';
  currentUser: string = '';
  users: string[] = [];
  displayMessages: any[] = [];
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
      this.messages.push(data);
      this.filterMessages();
    }
  }
  filterMessages(){
    this.displayMessages = this.messages.filter((m:any) => m.to == this.currentUser || m.from == this.currentUser)
  }
}
