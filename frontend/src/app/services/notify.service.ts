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

  saveEvaso(username: string, orderId: string, message: string): Observable<Notify> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.post<Notify>(this.endPoint+'/createNotify', { username, message, orderId }, { headers });
  }
}
