import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {ChatMessage} from "../models/chatMessage";
import {GeneralService} from "./-general.service";
import {ChatUser} from "../models/chatUser";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  endPoint = "http://localhost:3000/api/chat";

  constructor(private http: HttpClient, private generalService: GeneralService) { }

  getMessagesForUser(userId: string | null, onlineReceivers: boolean): Observable<ChatMessage[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<ChatMessage[]>(`${this.endPoint}/messages/${userId}`, {headers, params: {onlineReceivers: onlineReceivers}});
  }

  deleteMessage(username: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.delete(`${this.endPoint}/messages/${username}`, {headers});
  }

  getUserChatOpen(): Observable<ChatUser[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<ChatUser[]>(`${this.endPoint}/usersOpen`, {headers});
  }
}
