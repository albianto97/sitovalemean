import {Component, OnInit} from '@angular/core';
import {Product, ProductService} from '../../core/services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Errore durante il caricamento prodotti.';
        this.loading = false;
      }
    });
  }

  editProduct(id: string | undefined) {
    if (id) {
      this.router.navigate(['/admin/product', id, 'edit']);
    }
  }

  newProduct() {
    this.router.navigate(['/admin/product/new']);
  }

  deleteProduct(id: string | undefined) {
    if (!id) return;

    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== id);
        },
        error: (err) => {
          alert(err.error?.message || 'Errore durante l’eliminazione.');
        }
      });
    }
  }
}

