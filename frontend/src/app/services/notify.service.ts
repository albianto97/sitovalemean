import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Notify} from "../models/notify";
import {Injectable} from "@angular/core";
import {GeneralService} from "./-general.service";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  endPoint = "http://localhost:3000/api/notification";

  constructor(private http: HttpClient, private generalService: GeneralService) { }

  saveEvaso(username: string, date: string, orderId: string, read: boolean, message: string): Observable<Notify> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.post<Notify>(this.endPoint+'/createNotify', { username, date, message, read, orderId }, { headers });
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
