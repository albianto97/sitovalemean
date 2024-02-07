import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { AuthService } from "../../services/auth.service";
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import {OrderService} from "../../services/order.service";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfiloComponent implements OnInit {

  user: User | undefined;
  bestProducts: Product[] = [];
  orders: Product[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filteredBestProducts: Product[] = [];
  selectedType: string | null = null;
  constructor(private auth: AuthService, private productService: ProductService, private orderService: OrderService) {

    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products);

      this.filteredProducts = this.products.slice(0, 3);
    });

    orderService.getOrdersFromUser().subscribe((oldOrders: any) => {
      console.log(oldOrders);
      this.orders = oldOrders.splice(0,3);

    })



  }
  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();

  }

}
