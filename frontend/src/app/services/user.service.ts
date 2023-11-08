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
  //   var body = JSON.stringify(user);
  // console.log(user);

    return this.http.post(this.endPoint+"/create-user", user);
  }
}
