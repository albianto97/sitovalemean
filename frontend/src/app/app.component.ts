import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { AdminDialogComponent } from "./components/admin-dialog/admin-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sitovalemean';
  tel = './assets/media/logo.png'; // Percorso all'immagine del logo
  des = './assets/media/logo.png'; // Percorso all'immagine del logo
  user: any;
  isLoginPage: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    protected route: Router,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    // Sottoscrizione agli eventi di navigazione per determinare la pagina attuale
    this.route.events.subscribe(d => {
      if (d instanceof NavigationEnd) {
        this.isLoginPage = this.route.url.endsWith("/login") || this.route.url.endsWith("/sign-in");
        this.calculateRoutes(); // Calcola i percorsi di navigazione in base al ruolo dell'utente
      }
    });
  }

  ngOnInit() {
    this.calculateRoutes(); // Calcola i percorsi di navigazione all'inizializzazione del componente
  }

  // Metodo per calcolare i percorsi di navigazione in base al ruolo dell'utente
  calculateRoutes() {
    this.user = this.authService.getUserFromToken();
    this.isAdmin = this.user ? this.user.role === "amministratore" : false;
  }

  // Metodo per aprire il dialogo dell'amministratore
  openAdminDialog(): void {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        console.log(`User ${result} will be made an admin`);
        this.userService.addAdmin(result).subscribe(() => {
          console.log('User promoted to admin');
        });
      } else {
        console.log("Result is empty or undefined.");
      }
    });
  }
}
