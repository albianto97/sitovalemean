import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { AuthService } from "../../services/auth.service";
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/order";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfiloComponent implements OnInit {

  user: User | undefined;
  bestProducts: Product[] = [];
  myOrders: Order[] = [];
  //bestProducts: Product[] = [];
  products: Product[] = [];
  constructor(private authService: AuthService, private productService: ProductService, private orderService: OrderService) {

    orderService.getOrderOfUserProduct().subscribe((response: any) => {
      console.log(response);
      this.bestProducts = response.bestProducts.splice(0,3);
    });

    this.user = authService.getUserFromToken();
    orderService.getOrdersFromUser().subscribe((oldOrders: any) => {
      console.log(oldOrders);
      this.myOrders = oldOrders;

    })

  }
  ngOnInit(): void {
    this.user = this.authService.getUserFromToken();

  }

}
