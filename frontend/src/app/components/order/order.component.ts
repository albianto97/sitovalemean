import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Status } from 'src/app/models/order';
import {SocketService} from "../../services/socket.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  @Input() order!: Order;
  @Input() selectUsername!: string;
  //@Input() isProfile: boolean = false;
  constructor(private router:Router, private socketService: SocketService, public authService: AuthService) {}
  getStatusIcon(status:string): string {
    let key = status as keyof typeof Status;
    return Status[key];
  }
  openDetail(orderPass: Order){
    this.router.navigate(['/order/detail'], { state: { orderId: orderPass._id } });
  }

  sendNotification(username: string| undefined) {
    this.socketService.sendNotification({username: username, message: "Ordine evaso"});

  }
}
