// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../models/product";
import {Observable} from "rxjs";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedType: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Fetch products from your service
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.filteredProducts = this.products;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  filterProducts(type: string): void {
    this.selectedType = type;
    if (type === 'TORTA' || type === 'GELATO') {
      this.filteredProducts = this.products.filter((product) => product.type === type);
    } else {
      this.filteredProducts = this.products;
    }
  }
}
