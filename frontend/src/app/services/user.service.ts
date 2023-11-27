import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import {Observable} from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class UserService {
  endPoint = "http://localhost:3000/api/user";

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.endPoint);
  }

  public createUser(user: User):any {
    return this.http.post(this.endPoint+"/create-user", user);
  }

  //TODO: CAMBIARE CODICE UTENTE CON QUALCOSA DI GENERALE
  public getProfile(): Observable<User[]> {
    //return this.http.get<User[]>(this.endPoint);
    return this.http.get<User[]>(this.endPoint+"/65402ce9e06d2d48ea85baf3");
  }

}
