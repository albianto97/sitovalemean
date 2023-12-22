// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../services/product.service";
import {Product} from "../../../models/product";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // Assicurati che il tipo corrisponda ai dati effettivi

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }
}
