import { Component } from '@angular/core';
import { Order, OrderType } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

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
  constructor(private orderService: OrderService, private cartService: CartService, private authService: AuthService) {
    this.productsInCart = cartService.getCart().products;
    this.user = this.authService.getUserFromToken();
  }
  // assegno il valore digitato nella text-area ad una variabile
  handleInputTextArea(ev: any) {
    this.note = ev.target.value
  }
  creaOrdine() {
    console.log(this.user);
    
    if (this.user) {
      const order = {
        creationDate: new Date(),
        status: 'inAttesa',
        note: this.note,
        orderType: this.selectedOrderType,
        products: this.productsInCart,
        user: this.user._id
      };
      console.log(order);
      
      this.orderService.createOrder(order).subscribe(result => {
        console.log(result, order);
      });
    } else {
      // deve effettuare il login per poter effettuare l'ordine
    }


  }
}
