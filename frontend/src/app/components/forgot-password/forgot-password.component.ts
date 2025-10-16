import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;

  constructor(private auth: AuthService, private toast: ToastService) {}

  onSubmit() {
    this.loading = true;
    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.toast.show('Email di reset inviata! Controlla la tua casella di posta.');
        this.loading = false;
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Errore invio email.', true);
        this.loading = false;
      }
    });
  }
}
