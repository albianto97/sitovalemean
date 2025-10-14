import { Component } from '@angular/core';

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

  constructor(
    private authService: AuthService,
    private reservationService: ReservationService
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
}
