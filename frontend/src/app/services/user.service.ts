import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  endPoint = "http://localhost:3000/api/user";

  constructor(private http: HttpClient) { }
  public createUser(user: User):any {
    return this.http.post(this.endPoint+"/create-user", user);
  }
  public login(user: User):any {
    return this.http.post(this.endPoint+"/login", user);
  }
}
