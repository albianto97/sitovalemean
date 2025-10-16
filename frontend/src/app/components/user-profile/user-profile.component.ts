import {Component, OnInit} from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import {AuthService} from '../../core/services/auth.service';
import {ReservationService} from '../../core/services/reservation.service';


@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  reservations: any[] = [];
  loading = true;
  showPasswordForm = false;
currentPassword = '';
newPassword = '';
confirmPassword = '';

  constructor(
    private authService: AuthService,
    private reservationService: ReservationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadReservations();
  }

  loadUser(): void {
    this.authService.getUserProfile().subscribe({
      next: (res) => (this.user = res),
      error: () => (this.user = null)
    });
  }

  loadReservations(): void {
    this.reservationService.getMyReservations().subscribe({
      next: (res) => {
        this.reservations = res.products || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  updateProfile() {
    this.authService.updateProfile(this.user).subscribe({
      next: () => this.toast.show('Profilo aggiornato con successo!'),
      error: () => this.toast.show('Errore durante l’aggiornamento', true)
    });
  }
  togglePasswordForm() {
  this.showPasswordForm = !this.showPasswordForm;
}

resetPassword() {
  if (this.newPassword !== this.confirmPassword) {
    this.toast.show('Le password non coincidono', true);
    return;
  }

  this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
    next: () => {
      this.toast.show('Password aggiornata con successo!');
      this.showPasswordForm = false;
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    },
    error: (err) => {
      this.toast.show(err.error?.message || 'Errore durante il cambio password', true);
    }
  });
}

}
