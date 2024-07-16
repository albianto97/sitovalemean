import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ChatMessage } from "../models/chatMessage";
import { GeneralService } from "./-general.service";
import { ChatUser } from "../models/chatUser";
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  endPoint = environment.apiUrl + "/chat"; // URL del server API per la chat

  constructor(private http: HttpClient, private generalService: GeneralService) { }

  // Metodo per ottenere i messaggi di un utente specifico
  getMessagesForUser(userId: string | null, onlineReceivers: boolean): Observable<ChatMessage[]> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<ChatMessage[]>(`${this.endPoint}/messages/${userId}`, {
      headers,
      params: { onlineReceivers: onlineReceivers } // Passa i parametri della query
    });
  }

  // Metodo per eliminare i messaggi di un utente specifico
  deleteMessage(username: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.delete(`${this.endPoint}/messages/${username}`, { headers });
  }

  // Metodo per ottenere gli utenti con chat aperte
  getUserChatOpen(): Observable<ChatUser[]> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<ChatUser[]>(`${this.endPoint}/usersOpen`, { headers });
  }
}
