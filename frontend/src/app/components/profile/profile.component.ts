import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { AuthService } from "../../services/auth.service";
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { OrderService } from "../../services/order.service";
import { Order } from "../../models/order";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfiloComponent implements OnInit {

  user: User | undefined;
  bestProducts: Product[] = [];
  myOrdersTotal: Order[] = [];
  myOrdersView: Order[] = [];
  pageSize: number = 3;
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = 3;

  constructor(private authService: AuthService, private productService: ProductService, private orderService: OrderService) {
    orderService.getOrderOfUserProduct().subscribe((response: any) => {
      console.log(response);
      this.bestProducts = response.bestProducts.splice(0, 3);
    });

    this.user = authService.getUserFromToken();
    this.loadOrders();
  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromToken();
  }

  loadOrders(): void {
    this.orderService.getOrdersFromUser().subscribe((oldOrders: any) => {
      console.log(oldOrders);
      this.myOrdersTotal = oldOrders;
      this.myOrdersView = oldOrders.slice(this.startIndex, this.endIndex);
    });
  }

  onPageChange(event: any): void {
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    // Aggiorna myOrdersView con la porzione corretta degli ordini
    this.myOrdersView = this.myOrdersTotal.slice(this.startIndex, this.endIndex);
  }

}
