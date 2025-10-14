import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service'; // 👈 opzionale se hai i toast bootstrap

@Component({
  selector: 'app-login-register',
  standalone: false,
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {
  isLoginMode = true;
  username = '';
  email = '';
  password = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService // 👈 se usi i toast bootstrap
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    this.loading = true;

    if (this.isLoginMode) {
      // 🔐 LOGIN
      this.auth.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          this.loading = false;

          // salva user info (opzionale se /me restituisce utente)
          this.auth.setUser(res.user);

          // ✅ messaggio toast di benvenuto
          const role = this.auth.isAdmin() ? 'admin' : 'user';
          this.toast.show(
            `Benvenuto ${role === 'admin' ? 'amministratore' : this.email}!`,
            false
          );

          // redirect in base al ruolo
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Errore login:', err);
          this.toast.show('Credenziali non valide', true);
        }
      });
    } else {
      // 🆕 REGISTRAZIONE
      this.auth
        .register({ username: this.username, email: this.email, password: this.password })
        .subscribe({
          next: () => {
            this.loading = false;
            this.toast.show('Registrazione completata! Ora puoi accedere.');
            this.isLoginMode = true;
          },
          error: (err) => {
            this.loading = false;
            console.error('Errore registrazione:', err);
            this.toast.show('Errore durante la registrazione', true);
          }
        });
    }
  }
}
