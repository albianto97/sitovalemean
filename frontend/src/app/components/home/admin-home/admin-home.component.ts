import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {
    // Verifica se l'utente è amministratore
    this.isAdmin = authService.isAdmin();
  }
}
