import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router, private authService: AuthService) {}

  // Metodo per determinare se la route può essere attivata
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Controlla se l'utente è autenticato
    if (this.authService.isAuthenticated()) {
      return true; // Consente l'attivazione della route
    } else {
      // Se l'utente non è autenticato, reindirizza alla pagina di login
      this.router.navigate(['/login']);
      return false; // Impedisce l'attivazione della route
    }
  }
}
