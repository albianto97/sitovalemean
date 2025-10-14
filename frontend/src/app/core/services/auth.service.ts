import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  // 🔁 Stato reattivo
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  private role$ = new BehaviorSubject<string | null>(this.getRoleFromToken());

  constructor(private http: HttpClient) {}

  // ✅ Controlla se esiste il token
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Estrae il ruolo dal token JWT
  private getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload: any = jwtDecode(token);
      return payload.role || null;
    } catch {
      return null;
    }
  }

  // 🧠 LOGIN
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.token);
        this.loggedIn$.next(true);
        this.role$.next(this.getRoleFromToken());
        return res;
      })
    );
  }
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data);
  }

  // 🆕 REGISTRAZIONE
  register(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // 👤 Profilo utente
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn$.next(false);
    this.role$.next(null);
  }

  // 🧭 Observable per componenti reattivi
  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  isAdmin$(): Observable<boolean> {
    return this.role$.asObservable().pipe(map((role) => role === 'admin'));
  }

  // ✅ versioni “sincrone” (per chiamate dirette)
  isLoggedIn(): boolean {
    return this.loggedIn$.value;
  }

  isAdmin(): boolean {
    return this.role$.value === 'admin';
  }
}
