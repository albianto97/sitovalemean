import { Component } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';


@Component({
  selector: 'app-product-list',
  standalone:false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  reservedIds: string[] = [];

  constructor(
    private productService: ProductService,
    private reservationService: ReservationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadMyReservations();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => (this.products = products),
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        error: () => this.toast.show('Errore nel caricamento prodotti', true)
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
    if (this.isReserved(product._id)) {
      this.reservationService.removeProduct(product._id!).subscribe({
        next: () => {
          product.quantity++;
          this.reservedIds = this.reservedIds.filter(id => id !== product._id);
        },
        error: () => alert('Errore nel rilascio del prodotto.')
      });
    } else {
      if (product.quantity <= 0) {
        alert('Prodotto esaurito!');
        return;
      }
      this.reservationService.addProduct(product._id!).subscribe({
        next: () => {
          product.quantity--;
          this.reservedIds.push(product._id!);
        },
        next: () => this.toast.show('Prodotto prenotato con successo!'),
        error: () => this.toast.show('Errore nella prenotazione', true)
      });
    }
  }
}
