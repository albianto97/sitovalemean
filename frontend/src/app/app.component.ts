import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sitovalemean';
  logoPath = './assets/media/logo.png'; // Percorso all'immagine del logo
  user: any;
  isLoginPage: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private route: Router
  ) {
    // Sottoscrizione agli eventi di navigazione per determinare la pagina attuale
    this.route.events.subscribe(d => {
      if (d instanceof NavigationEnd) {
        this.isLoginPage = this.route.url.endsWith("/login") || this.route.url.endsWith("/sign-in");
        this.calculateRoutes();
      }
    });
  }

  ngOnInit() {
    this.calculateRoutes();
  }

  // Metodo per calcolare il ruolo dell'utente e aggiornare la navbar
  calculateRoutes() {
    this.user = this.authService.getUserFromToken();
    this.isAdmin = this.user ? this.user.role === "amministratore" : false;
  }

  // Metodo per il logout
  logout() {
    this.authService.logout();
    this.route.navigate(['/login']);
  }
}
