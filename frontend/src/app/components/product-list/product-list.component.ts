import { Component } from '@angular/core';

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
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
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
        error: () => alert('Errore nella prenotazione.')
      });
    }
  }
}
