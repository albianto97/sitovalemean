import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import {OrderService} from "../../../services/order.service";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {
  order: any;
  orderStates: string[] = [];
  isAdmin:boolean = false;
  constructor(private route: ActivatedRoute, private productService: ProductService,
              public authService:AuthService,
              private orderService: OrderService) { }
  ngOnInit(): void {
    let orderId = '';
    const state = history.state;
    if (state && state.orderId) {
      orderId = state.orderId;
    }
    let order = this.orderService.getOrder(orderId).subscribe((order: any) => this.order = order);
    this.orderStates = Object.keys(Status);

  }

}
