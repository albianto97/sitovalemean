import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Status } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @Input() order!: Order;
  @Input() selectUsername!: string;
  @Input() isProfile: boolean = false;
  username: string = "";

  constructor(private router: Router, private userService: UserService) { }
  ngOnInit(): void {
    this.userService.getUserById(this.order.user).subscribe((user:User) =>{
      this.username = user.username;
    })
  }
  getStatusIcon(status: string): string {
    let key = status as keyof typeof Status;
    return Status[key];
  }
  openDetail(orderPass: Order) {
    this.router.navigate(['/order/detail'], { state: { order: orderPass } });
  }
}
