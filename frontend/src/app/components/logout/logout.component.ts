import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  // Costruttore con iniezione delle dipendenze necessarie
  constructor(private auth: AuthService, private router: Router) {
    // Chiama il metodo di logout quando il componente viene istanziato
    this.logOut();
  }

  // Metodo per effettuare il logout
  logOut() {
    // Chiama il metodo di logout del servizio AuthService
    this.auth.logout();
    // Ricarica la pagina
    location.reload();
    // Può essere commentato se la pagina si ricarica automaticamente dopo il logout
    // this.router.navigate(['/login']);
  }
}
