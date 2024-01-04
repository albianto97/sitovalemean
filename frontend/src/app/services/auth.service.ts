import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endPoint = "http://localhost:3000/api/user";; // URL del tuo server Express.js
  private token: string | null = null;
  constructor(private http: HttpClient) { }
  login(user: User): Observable<any> {
    return this.http.post(this.endPoint+'/login',user).pipe(
      tap((response : any )=> {
        this.token = response.token;
        this.saveTokenToLocalStorage(this.token!);
      })
    );
  }
  logout() {
    this.token = null;
    this.removeTokenFromLocalStorage();
    // Effettua altre operazioni di logout se necessario
  }

  isAuthenticated(): boolean {
    // Implementa la logica per verificare se l'utente è autenticato
    var user = this.getUserFromToken();
    console.log(user);    
    return !!user;
  }

  getUserFromToken(): any {
    this.token = this.getTokenFromLocalStorage();
    if (this.token) {
      return jwtDecode(this.token);
    }
    return null;
  }

  saveTokenToLocalStorage(token: string): void {
    localStorage.setItem('authToken', token);
  }
  
  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('authToken');
  }

  removeTokenFromLocalStorage(): void {
    localStorage.removeItem('authToken');
  }
}
