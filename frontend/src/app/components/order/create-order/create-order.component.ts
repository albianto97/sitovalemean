import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  constructor(private orderService: OrderService) { }
  creaOrdine() {
    const order = {
      creationDate: new Date(),
      status: 'in attesa',
      note: 'Questo è un ordine di prova',
      orderType: 'domicilio',
      products: [
        {
          productId: '6564af0c79c5b00a9e6c58cc', // Sostituisci con un ID di prodotto valido
          quantity: 2
        },
        {
          productId: '6564afdc595c21d4cf11fc5e', // Sostituisci con un ID di prodotto valido
          quantity: 1
        }
      ],
      user: '6583645f340b9b6eedd3a7f8' // Sostituisci con un ID utente valido
    };
    this.orderService.createOrder(order).subscribe(result => {
      console.log(result);
      
    });
  }
}
