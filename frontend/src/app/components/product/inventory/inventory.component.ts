import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedType: string | null = null;

  constructor(private productService: ProductService, public authService: AuthService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products)
      // Inizializza i prodotti filtrati con tutti i prodotti
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
    console.log(this.selectedType);
    console.log(this.filteredProducts);
  }
}
