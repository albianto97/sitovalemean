import { Component, Input, OnInit } from '@angular/core';

import {Order, Status} from "../../../models/order";
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})

export class OrdersComponent implements OnInit{
  orders :Order[] = []
  constructor(private orderService: OrderService){}
  ngOnInit(): void {
    this.getOrders();
  }
  getOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
    });
}
}
