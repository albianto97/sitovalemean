import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { Product, ProductService } from '../../core/services/product.service';
import { ReservationService } from '../../core/services/reservation.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  reservedIds: string[] = [];
  isAdmin = false;

  constructor(
    private productService: ProductService,
    private reservationService: ReservationService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.isAdmin$().subscribe(val => (this.isAdmin = val));
    this.loadProducts();
    this.loadMyReservations();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        this.toast.show('Errore nel caricamento prodotti', true);
        this.error = err.error?.message || 'Errore nel caricamento prodotti.';
        this.loading = false;
      }
    });
  }

  loadMyReservations(): void {
    this.reservationService.getMyReservations().subscribe({
      next: (res) => {
        this.reservedIds = res.products?.map((p: any) => p.productId?._id) || [];
      },
      error: () => {}
    });
  }

  isReserved(productId: string | undefined): boolean {
    return this.reservedIds.includes(productId || '');
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }

  toggleReservation(product: Product): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.show('Devi accedere per prenotare.', true);
      return;
    }

    const available = product.stock - product.reserved;

    if (this.isReserved(product._id)) {
      // Rilascio
      this.reservationService.removeProduct(product._id!).subscribe({
        next: () => {
          product.reserved--; // meno prenotati
          this.reservedIds = this.reservedIds.filter(id => id !== product._id);
        },
        error: () => this.toast.show('Errore nel rilascio del prodotto.', true)
      });
    } else {
      // Prenotazione
      if (available <= 0) {
        this.toast.show('Prodotto esaurito!', true);
        return;
      }
      this.reservationService.addProduct(product._id!).subscribe({
        next: () => {
          product.reserved++; // più prenotati
          this.toast.show('Prodotto prenotato con successo!');
          this.reservedIds.push(product._id!);
        },
        error: () => this.toast.show('Errore nella prenotazione', true)
      });
    }
  }
}
