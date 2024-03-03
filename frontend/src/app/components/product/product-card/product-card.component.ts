// product-card.component.ts
import {Component, Input, Output, EventEmitter} from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import {AuthService} from "../../../services/auth.service";
import {ProductService} from "../../../services/product.service";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isViewCarrello: boolean = false;
  @Output() itemRemoved = new EventEmitter();
  isAdmin: boolean = false;
  quantityToAdd: any;

  constructor(public cartService: CartService,
              private authService: AuthService,
              private productService: ProductService) {}

  ngOnInit(): void {
    let itemId = this.product._id;
    let quantity = this.cartService.getQuantityByProductId(itemId);
    this.product.cartQuantity = quantity;
    this.isAdmin = this.authService.isAdmin();
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

  removeProduct(){
    this.cartService.removeProduct(this.product._id)
    this.itemRemoved.emit();
  }

  addOneToQuantity(productId: string) {
    if (this.quantityToAdd > 0) {
      this.productService.addQuantityToProduct(productId, this.quantityToAdd).subscribe(() => {
        // Aggiorna la quantità nel componente
        if (this.product.disponibilita) this.product.disponibilita += this.quantityToAdd;
      });
    }else {
      this.productService.addOneToProductQuantity(productId).subscribe((response) => {
        // Aggiornamento della quantità disponibile nel componente
        if (this.product.disponibilita) this.product.disponibilita++;
      });
    }
  }

  removeOneFromQuantity(productId: string) {
    this.productService.removeOneFromProductQuantity(productId).subscribe((response) => {
      // Aggiornamento della quantità disponibile nel componente
      if(this.product.disponibilita) this.product.disponibilita--;
    });
  }
}
