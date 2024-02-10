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
  //bestProducts: Product[] = [];
  products: Product[] = [];
  productCounts: any = {}; // Inizializza productCounts come un oggetto vuoto
  constructor(private auth: AuthService, private productService: ProductService, private orderService: OrderService) {



    orderService.getOrdersFromUser().subscribe((response: any) => {
      console.log(response);
      this.bestProducts = response.bestProducts.splice(0,3);
    });



  }
  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();

  }

}
