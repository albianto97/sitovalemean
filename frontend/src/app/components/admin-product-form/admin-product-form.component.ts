import {Component, OnInit} from '@angular/core';
import {Product, ProductService} from '../../core/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-admin-product-form',
  standalone: false,
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css'
})
export class AdminProductFormComponent implements OnInit {
  product: Product = { name: '', description: '', quantity: 0, link: '' };
  editMode = false;
  loading = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.loading = true;
      this.productService.getProduct(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Errore nel caricamento del prodotto.');
        }
      });
    }
  }
  goBack(): void {
    this.router.navigate(['/admin']);
  }

  onSubmit() {
    if (!this.product.name || !this.product.description) {
      alert('Compila tutti i campi obbligatori.');
      return;
    }

    this.loading = true;

    const request = this.editMode
      ? this.productService.updateProduct(this.product._id!, this.product)
      : this.productService.createProduct(this.product);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Errore durante il salvataggio.');
      }
    });
  }
}
