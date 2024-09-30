import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedType: string | null = null;
  pageSize: number = 6;
  currentPage: number = 0;
  totalFilteredProducts: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService, public authService: AuthService) { }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.updateFilteredProducts();
      },
      (error) => {
        console.error('Errore durante il recupero dei prodotti:', error);
      }
    );
  }


  // Metodo per gestire il cambio di pagina
  onPageChange(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.currentPage = event.pageIndex;
    if (this.selectedType === '' || this.selectedType === null) {
      this.filteredProducts = this.products.slice(startIndex, endIndex);
    }
    this.pageSize = event.pageSize;
  }

  // Metodo per aggiornare i prodotti filtrati
  private updateFilteredProducts(): void {
    if (this.selectedType === '' || this.selectedType === null) {
      this.filteredProducts = this.products.slice(0, this.pageSize);
      this.totalFilteredProducts = this.products.length;
    }
  }
}
