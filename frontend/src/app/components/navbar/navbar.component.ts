import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.isLoggedIn$().subscribe(status => this.isLoggedIn = status);
    this.auth.isAdmin$().subscribe(admin => this.isAdmin = admin);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}


