import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private authService: AuthService) {}

  // Metodo per creare le intestazioni (headers) per l'autorizzazione
  createHeadersForAuthorization(): HttpHeaders {
    // Ottiene il token di autenticazione dal servizio AuthService
    const token = this.authService.getTokenFromLocalStorage();

    // Crea le intestazioni con il token di autorizzazione
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}`
    });

    return headers; // Ritorna le intestazioni create
  }
}
