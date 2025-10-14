import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 🔁 Reactivity: si aggiorna in tempo reale
    this.auth.isLoggedIn$().subscribe((status) => (this.isLoggedIn = status));
    this.auth.isAdmin$().subscribe((admin) => (this.isAdmin = admin));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
