import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NonAdministratorGuard {
  constructor(private router: Router, private authService: AuthService) {}

  // Metodo per determinare se la route può essere attivata
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Controlla se l'utente non è un amministratore
    if (!this.authService.isAdmin()) {
      return true; // Consente l'attivazione della route
    } else {
      // Se l'utente è un amministratore, reindirizza alla lista dei prodotti
      this.router.navigate(['/productList']);
      return false; // Impedisce l'attivazione della route
    }
  }
}
