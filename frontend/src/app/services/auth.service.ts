import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endPoint = environment.apiUrl + "/user"; // URL del server Express.js
  private token: string | null = null;

  constructor(private http: HttpClient) { }

  // Metodo per effettuare il login
  login(user: User): Observable<any> {
    return this.http.post(this.endPoint + '/login', user).pipe(
      tap((response: any) => {
        this.token = response.token;
        this.saveTokenToLocalStorage(this.token!);
      })
    );
  }

  // Metodo per effettuare il logout
  logout() {
    this.token = null;
    this.removeTokenFromLocalStorage();
    // Effettua altre operazioni di logout se necessario
  }

  // Metodo per verificare se l'utente è autenticato
  isAuthenticated(): boolean {
    const user = this.getUserFromToken();
    return !!user;
  }

  // Metodo per ottenere l'utente dal token
  getUserFromToken(): any {
    this.token = this.getTokenFromLocalStorage();
    if (this.token) {
      return jwtDecode(this.token);
    }
    return null;
  }

  // Metodo per salvare il token nel localStorage
  saveTokenToLocalStorage(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Metodo per ottenere il token dal localStorage
  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('authToken');
  }

  // Metodo per rimuovere il token dal localStorage
  removeTokenFromLocalStorage(): void {
    localStorage.removeItem('authToken');
  }

  // Metodo per verificare se l'utente è un amministratore
  isAdmin(): boolean {
    const user = this.getUserFromToken();
    if (user) {
      return user.role === "amministratore";
    } else {
      return false;
    }
  }
}
