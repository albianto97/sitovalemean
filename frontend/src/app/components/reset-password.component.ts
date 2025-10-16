import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  token: string | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private toast: ToastService
  ) {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.toast.show('Le password non coincidono', true);
      return;
    }

    this.loading = true;
    this.auth.resetPassword(this.token!, this.newPassword).subscribe({
      next: () => {
        this.toast.show('Password aggiornata con successo!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Errore reset password', true);
        this.loading = false;
      }
    });
  }
}
