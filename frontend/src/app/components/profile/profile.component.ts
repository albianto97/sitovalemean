import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { AuthService } from "../../services/auth.service";
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import {OrderService} from "../../services/order.service";

interface ProductWithCount {
  product: Product; // Suppongo che Product sia l'interfaccia o la classe per i tuoi prodotti
  count: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfiloComponent implements OnInit {


  user: User | undefined;
  bestProducts: ProductWithCount[] = [];
  //bestProducts: Product[] = [];
  products: Product[] = [];
  productCounts: any = {}; // Inizializza productCounts come un oggetto vuoto
  constructor(private auth: AuthService, private productService: ProductService, private orderService: OrderService) {



    orderService.getOrdersFromUser().subscribe((response: any) => {
      console.log(response);
      this.bestProducts = response.bestProducts;
    });



  }
  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();

  }

}
