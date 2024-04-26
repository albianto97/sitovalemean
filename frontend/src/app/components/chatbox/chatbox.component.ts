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

  messages: ChatMessage[] = [];
  message: string = '';
  currentUser: string = '';
  users: ChatUser[] = [];
  displayMessages: ChatMessage[] = [];
  newMessage: boolean = false;
  showBox: boolean = false;
  @Input() isAdmin: boolean = false;
  private userId: any = '';

  constructor(private socketService: SocketService, private authService: AuthService, private chatService: ChatService) {
    socketService.registerChatHandlers((event: any, data: any) => this.socketCallback(event, data))
  }

  ngOnInit() {
    if (!this.isAdmin) {
      this.currentUser = "admin";
    }
    this.userId = this.authService.getUserFromToken();
    this.getChatForUser(this.userId._id);
    console.log("message1: "+ this.messages);
  }

  getChatForUser(userId: string) {
    this.chatService.getMessagesForUser(userId)
      .subscribe((messages: ChatMessage[]) => {
        console.log("message: "+ messages);
        this.messages = messages;
        this.filterMessages();
      })
  }

  sendMessage() {
    if (this.message) {
      let messageItem: ChatMessage = { to: this.currentUser, content: this.message, from: "" };
      this.socketService.sendMessage(messageItem);
      this.filterMessages();
      this.message = '';
    }
  }

  socketCallback(event: any, data: any) {
    if (event == 'newMessage') {
      if (this.isAdmin) {
        if (this.users.length == 0) {
          this.currentUser = data.from;
        }
        if (data.from != "admin" && !this.users.some(u => u.username === data.from)) {
          this.users.push({ username: data.from, newMessages: this.users.length > 0 });
        } else {
          let user = this.users.find(u => u.username === data.from);
          if (user) {
            user.newMessages = data.from != this.currentUser;
          }
        }
      }
      this.filterMessages();
    }
  }

  filterMessages() {
    this.displayMessages = this.messages.filter((m: ChatMessage) => m.to == this.currentUser || m.from == this.currentUser);

    if (this.users.length > 0) {
      const currentUserObj = this.users.find(u => u.username === this.currentUser);
      if (currentUserObj) {
        currentUserObj.newMessages = false;
      }
    }

    this.newMessage = this.users.some(u => u.newMessages);
    console.log("message2: "+ this.messages);
  }

}
