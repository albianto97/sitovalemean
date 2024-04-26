import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {ChatMessage} from "../models/chatMessage";
import {GeneralService} from "./-general.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  endPoint = "http://localhost:3000/api/chat";

  constructor(private http: HttpClient, private generalService: GeneralService) { }

  getMessagesForUser(userId: string | null): Observable<ChatMessage[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<ChatMessage[]>(`${this.endPoint}/messages/${userId}`, {headers});
  }
}
