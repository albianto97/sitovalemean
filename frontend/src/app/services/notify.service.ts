import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Notify } from "../models/notify";
import { Injectable } from "@angular/core";
import { GeneralService } from "./-general.service";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  endPoint = environment.apiUrl + "/notification"; // URL del server API per le notifiche
  modify: Observable<any>;
  modifySubscribers: any[] = [];

  constructor(
    private http: HttpClient,
    private generalService: GeneralService,
    private authService: AuthService
  ) {
    // Inizializza l'osservabile modify che notifica i sottoscrittori sulle modifiche delle notifiche
    this.modify = new Observable<any>(subscriber => {
      this.modifySubscribers.push(subscriber);
    });
  }

  // Metodo per notificare i sottoscrittori delle modifiche
  notifySubscribers() {
    for (let i = 0; i < this.modifySubscribers.length; i++) {
      let s = this.modifySubscribers[i];
      s.next();
    }
  }

  // Metodo per creare una notifica
  createNotify(
    username: string,
    date: string,
    orderId: string,
    read: boolean,
    message: string,
    link: string = ""
  ): Observable<Notify> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.post<Notify>(
      `${this.endPoint}/createNotify`,
      { username, date, message, read, orderId, link },
      { headers }
    );
  }

  // Metodo per ottenere le notifiche di un utente
  getUserNotifications(username: string): Observable<Notify[]> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<Notify[]>(`${this.endPoint}/${username}`, { headers });
  }

  // Metodo per eliminare una notifica
  deleteNotification(notificationId: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.delete(`${this.endPoint}/${notificationId}`, { headers });
  }

  // Metodo per aggiornare lo stato di una notifica
  updateNotification(notificationId: string, read: boolean): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.put<any>(`${this.endPoint}/${notificationId}`, { read }, { headers });
  }
}
