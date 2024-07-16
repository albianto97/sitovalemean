import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from "rxjs";
import { GeneralService } from "./-general.service";
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endPoint = environment.apiUrl + "/user"; // URL del server API per gli utenti

  constructor(private http: HttpClient, private generalService: GeneralService) { }

  // Metodo per ottenere tutti gli utenti
  public getUsers(): Observable<User[]> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<User[]>(this.endPoint, { headers });
  }

  // Metodo per creare un nuovo utente
  public createUser(user: User): Observable<any> {
    return this.http.post(this.endPoint + "/create-user", user);
  }

  // Metodo per effettuare il login
  public login(user: User): Observable<any> {
    return this.http.post(this.endPoint + "/login", user);
  }

  // Metodo per cercare utenti per nome utente
  public searchUsers(username: string): Observable<User[]> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<User[]>(this.endPoint + "/searchUsersByUsername?username=" + username, { headers });
  }

  // Metodo per ottenere un singolo utente per ID
  getSingleUserById(id: string): Observable<User> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<User>(`${this.endPoint}/${id}`, { headers });
  }

  // Metodo per aggiungere un amministratore
  public addAdmin(username: string): Observable<any> {
    const data = { username: username }; // Assicurati che il nome utente sia incluso nell'oggetto data
    return this.http.post(this.endPoint + "/addAdmin", data);
  }

  // Metodo per ottenere un utente per ID
  public getUserById(userId: string): Observable<User> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<User>(this.endPoint + "/" + userId, { headers });
  }
}
