import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import {Observable} from "rxjs";
import {GeneralService} from "./-general.service";



@Injectable({
  providedIn: 'root'
})
export class UserService {
  endPoint = "http://localhost:3000/api/user";

  constructor(private http: HttpClient, private generalService: GeneralService) { }

  public getUsers(): Observable<User[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<User[]>(this.endPoint, {headers});
  }

  public createUser(user: User):any {
    return this.http.post(this.endPoint+"/create-user", user);
  }
  public login(user: User):any {
    return this.http.post(this.endPoint+"/login", user);
  }

  public searchUsers(username : string): Observable<User[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<User[]>(this.endPoint + "/searchUsersByUsername?username="+ username,{headers});
  }
  getSingleUserById(id: string): Observable<User> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<User>(`${this.endPoint}/${id}`, { headers });
  }
  public getUserById(userId : string): Observable<User> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<User>(this.endPoint + "/"+ userId,{headers});
  }



}
