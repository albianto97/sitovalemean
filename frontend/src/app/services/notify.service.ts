import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Notify} from "../models/notify";
import {Injectable} from "@angular/core";
import {GeneralService} from "./-general.service";
import {AuthService} from "./auth.service";
import {EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  endPoint = "http://localhost:3000/api/notification";
  modify: Observable<any>;
  modifySubscribers: any[] = [];



  constructor(private http: HttpClient, private generalService: GeneralService, private authService: AuthService) {
    this.modify = new Observable<any>(subscriber => {
      this.modifySubscribers.push(subscriber);
    })
  }

  notifySubscribers(){
    for(let i = 0; i< this.modifySubscribers.length; i++){
      let s = this.modifySubscribers[i];
      s.next();
    }
  }

  createNotify(username: string, date: string, orderId: string, read: boolean, message: string, link:string = ""): Observable<Notify> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.post<Notify>(this.endPoint+'/createNotify', { username, date, message, read, orderId, link }, { headers });
  }
  getUserNotifications(username: string): Observable<Notify[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<Notify[]>(`${this.endPoint}/${username}`, {headers});
  }
  deleteNotification(notificationId: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.delete(`${this.endPoint}/${notificationId}`, { headers });
  }
  updateNotification(notificationId: string, read: boolean): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put<any>(`${this.endPoint}/${notificationId}`, { read }, { headers });
  }
}
