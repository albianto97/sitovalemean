// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../models/product";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedType: string | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products);

      this.filteredProducts = this.products;
    });
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
