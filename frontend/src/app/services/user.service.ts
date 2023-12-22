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
  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.endPoint}/login`, user);
  }

  // Aggiungi un metodo per salvare e recuperare il token
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Aggiungi un metodo per ottenere il profilo dell'utente
  getProfile(): Observable<any> {
    // Utilizza il token per autenticare la richiesta
    const token = this.getToken();
    // Aggiungi il token all'header della richiesta
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.endPoint}/profile`, { headers });
  }

}
