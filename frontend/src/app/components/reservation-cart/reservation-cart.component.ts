import {Component, OnInit} from '@angular/core';
import {ReservationService} from '../../core/services/reservation.service';

@Component({
  selector: 'app-reservation-cart',
  standalone: false,
  templateUrl: './reservation-cart.component.html',
  styleUrl: './reservation-cart.component.css'
})
export class ReservationCartComponent implements OnInit {
  products: any[] = [];
  loading = true;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getMyReservations().subscribe({
      next: (res) => {
        this.products = res.products || [];
        this.loading = false;
      },
      error: () => {
        alert('Errore nel caricamento delle prenotazioni.');
        this.loading = false;
      }
    });
  }

  removeItem(productId: string) {
    this.reservationService.removeProduct(productId).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.productId._id !== productId);
      },
      error: () => alert('Errore nel rilascio del prodotto.')
    });
  }

  clearAll() {
    if (confirm('Vuoi davvero svuotare tutte le prenotazioni?')) {
      this.reservationService.clearReservations().subscribe({
        next: () => (this.products = []),
        error: () => alert('Errore nello svuotamento prenotazioni.')
      });
    }
  }
}
