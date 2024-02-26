import { Component } from '@angular/core';
import { Order, OrderType } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import {Router} from "@angular/router";
import {Product} from "../../../models/product";

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  productsInCart = [];
  user: any | undefined;
  order: Order | null = null;
  // per creare dinamicamente la select della tipologia del'ordine
  orderTypes = Object.entries(OrderType).map(([key, value]) => ({ key, value }));
  selectedOrderType: string = 'ritiro';

  note: string | null = null;
  constructor(private router: Router,private orderService: OrderService, private cartService: CartService, private authService: AuthService) {
    this.productsInCart = cartService.getCart().products;
    this.user = this.authService.getUserFromToken();
  }
  // assegno il valore digitato nella text-area ad una variabile
  handleInputTextArea(ev: any) {
    this.note = ev.target.value
  }
  creaOrdine() {
    console.log(this.user);

    // Verifica se il carrello contiene almeno un prodotto
    if (this.productsInCart.length === 0) {
      // Messaggio di avviso o azione da eseguire quando il carrello è vuoto
      console.log("Impossibile creare un ordine perché il carrello è vuoto.");
      this.router.navigate(['productList']);
      return;
    }

    if (this.user) {
      const order = {
        creationDate: new Date(),
        status: 'inAttesa',
        note: this.note,
        orderType: this.selectedOrderType,
        products: this.productsInCart,
        user: this.user._id
      };

      this.orderService.createOrder(order).subscribe((result: any) => {
        console.log(result, order);
        if(result.result == 1){
          let productString = result.products.map((p: Product) => p.name).join(", ");
          alert("Impossibile, prodotti non disponibili: " + productString + "\nVerranno rimossi dal carrello!");
          for(let i =0; i < result.products.length; i++){
            this.cartService.removeProduct(result.products[i]._id);
          }
          this.router.navigate(["/view-cart"]);
        }else {
          this.cartService.emptyCart();
          this.router.navigate(['/profilo']);
        }
      });
    } else {
      // Deve effettuare il login per poter effettuare l'ordine
    }
  }
}
