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
  isLoginMode = true; // ✅ Alterna tra login e registrazione

  username = '';
  email = '';
  password = '';

  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    this.loading = true;

    if (this.isLoginMode) {
      // 🔐 LOGIN
      this.auth.login({ email: this.email, password: this.password }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.loading = false;
          alert(err.error?.message || 'Errore di login.');
        }
      });
    } else {
      // 🆕 REGISTRAZIONE
      this.auth.register({ username: this.username, email: this.email, password: this.password }).subscribe({
        next: () => {
          this.loading = false;
          alert('Registrazione completata! Ora puoi accedere.');
          this.isLoginMode = true;
        },
        error: err => {
          this.loading = false;
          alert(err.error?.message || 'Errore di registrazione.');
        }
      });
    }
  }
}
