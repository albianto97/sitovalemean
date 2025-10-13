import { Component } from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-register',
  standalone: false,
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {
  }

  onLogin() {
    this.auth.login({email: this.email, password: this.password}).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => alert(err.error.message || 'Errore di login')
    });
  }
}
