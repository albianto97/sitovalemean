import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Status } from 'src/app/models/order';
import {SocketService} from "../../services/socket.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  @Input() order!: Order;
  @Input() selectUsername!: string;
  //@Input() isProfile: boolean = false;
  constructor(private router:Router, private socketService: SocketService) {}
  getStatusIcon(status:string): string {
    let key = status as keyof typeof Status;
    return Status[key];
  }
  openDetail(orderPass: Order){
    this.router.navigate(['/order/detail'], { state: { order: orderPass } });
  }

  sendNotification(username: string| undefined) {
    this.socketService.sendNotification({username: username, message: "Ordine evaso"});

  }
}
