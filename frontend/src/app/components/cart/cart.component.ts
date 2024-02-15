import { Component } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../models/product";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  products : Product[] = [];
  constructor(private productService: ProductService) {}


  ngOnInit(): void {
    // Verifica se 'cart' è presente nello storage locale e se contiene un valore valido
    if (localStorage['cart']) {
      try {
        let cartProducts: any = JSON.parse(localStorage['cart']);
        let productIds = cartProducts.products.map((item: any) => item.productId);

        this.productService.getProductsById(productIds).subscribe((data) => {
          this.products = data;
          for(let i = 0; i < this.products.length; i++){
            let item: Product = this.products[i];
            let cartItem = cartProducts.products[i];
            item.quantity = cartItem.quantity;
          }

          console.log(this.products);
        });
      } catch (error) {
        console.error('Errore durante il parsing del valore JSON in localStorage:', error);
      }
    } else {
      console.error('Il valore di "cart" non è presente nello storage locale.');
    }
  }


}
