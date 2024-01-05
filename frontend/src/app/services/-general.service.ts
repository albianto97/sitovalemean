import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor( private authService :AuthService) { }
  createHeadersForAuthorization(){
    const headers = new HttpHeaders({
      'authorization': `Bearer ${this.authService.getTokenFromLocalStorage()}`
    });
    return headers;
  }
}
