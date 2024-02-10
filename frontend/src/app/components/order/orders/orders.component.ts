import { Component, Input } from '@angular/core';

import {Order, Status} from "../../../models/order";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})

export class OrdersComponent {
  @Input() order!: Order;
  constructor() {}
  getStatusIcon(status:string): string {
    let key = status as keyof typeof Status;
    return Status[key];
  }
}
