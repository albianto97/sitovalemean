import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  selectedType: string | null = null;
  maxVisualization: number = 6;

  constructor(private productService: ProductService, public authService: AuthService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      // Inizializza i prodotti visualizzati con tutti i prodotti
      this.displayedProducts = this.products.slice(0, this.maxVisualization);
    });
  }

  filterProducts(type: string): void {
    this.selectedType = type;
    if (type === 'TORTA' || type === 'GELATO') {
      this.displayedProducts = this.products.filter((product) => product.type === type).slice(0, this.maxVisualization);
    } else {
      this.displayedProducts = this.products.slice(0, this.maxVisualization);
    }
  }

  onPageChange(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.displayedProducts = this.products.slice(startIndex, endIndex);
    this.maxVisualization = endIndex;
  }
}
