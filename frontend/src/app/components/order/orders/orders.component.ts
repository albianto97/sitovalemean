import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  user: any;
  constructor(private authService: AuthService, private orderService: OrderService) {
    this.user = authService.getUserFromToken();
    orderService.getOrdersFromUser().subscribe((ordini:any) => {
      console.log(ordini);
      
    })
  }
}
