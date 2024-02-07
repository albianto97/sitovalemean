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
  products: Product[] = [];
  productCounts: any = {}; // Inizializza productCounts come un oggetto vuoto
  constructor(private auth: AuthService, private productService: ProductService, private orderService: OrderService) {


    /*orderService.getOrdersFromUser().subscribe((bestProducts: any) => {
      console.log(bestProducts);
      this.bestProducts = bestProducts.splice(0,3);

    })*/

    orderService.getOrdersFromUser().subscribe((response: any) => {
      console.log(response);
      this.bestProducts = response.splice(0, 3);
      this.productCounts = response.productCounts;
    });



  }
  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();

  }

}
