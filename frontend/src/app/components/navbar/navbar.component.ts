import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;
  isAdmin = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    // inizializza da stato salvato
    this.auth.refreshUserState();
    this.isLoggedIn = this.auth.isLoggedIn();
    this.isAdmin = this.auth.isAdmin();

    // sottoscrivi per aggiornamenti live
    this.auth.isLoggedIn$().subscribe((val) => (this.isLoggedIn = val));
    this.auth.isAdmin$().subscribe((val) => (this.isAdmin = val));
    this.auth.getUser$().subscribe((u) => (this.user = u));
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  toggleTheme() {
    this.theme.toggleTheme();
  }
}
