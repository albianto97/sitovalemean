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

  ngOnInit(): void {
    let itemId = this.product._id;
    let quantity = this.cartService.getQuantityByProductId(itemId);
    this.product.cartQuantity = quantity;
  }


  addItemToCart(itemId: string) {
    let quantity = this.cartService.getQuantityByProductId(itemId);
    let p: any = this.product;
    if(quantity < p.disponibilita) {
      this.cartService.addToCart(itemId, 1);
      (<any>this.product).cartQuantity++;
    }
    else{
      alert("Disponibilià esaurita: Non è possibile inserire questo prodotto nel carrello");
    }
  }
}
