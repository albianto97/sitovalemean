import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Status } from 'src/app/models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  @Input() order!: Order;
  @Input() selectUsername!: string;
  //@Input() isProfile: boolean = false;
  constructor(private router:Router) {}
  getStatusIcon(status:string): string {
    let key = status as keyof typeof Status;
    return Status[key];
  }
  openDetail(orderPass: Order){
    this.router.navigate(['/order/detail'], { state: { order: orderPass } });
  }
}
