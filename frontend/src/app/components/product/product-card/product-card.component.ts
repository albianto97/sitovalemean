// product-card.component.ts
import { Component, Input } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isViewCarrello: boolean = false;

  constructor(private cartService: CartService) {}

  addItemToCart(itemId: string) {
    this.cartService.addToCart(itemId, 1);
  }
}
