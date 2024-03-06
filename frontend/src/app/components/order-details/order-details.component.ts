import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product.service";
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/order";
import {Product} from "../../models/product";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {
  orderId: String | null = '' ;
  order: Order | null = null;
  productsLoaded: boolean = false;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private productService: ProductService
  ) { }

 ngOnInit() {
   const orderId: string | null = this.route.snapshot.paramMap.get('orderId');
   this.orderId = orderId;
   if (orderId) {
     this.orderService.getOrder(orderId).subscribe((d: Order) =>{
       this.order = d;
       let products = this.order.products;
       let productIds = products.map(c => c.productId);
       this.productService.getProductsById(productIds).subscribe((p: Product[]) =>{
         if(this.order) {
           for (let i = 0; i < p.length; i++) {
             this.products.push(<Product>Object.assign({}, this.order.products[i], p[i]));
             //delete this.order.products[i].productId;
           }
           this.productsLoaded = true;
           console.log(this.products);
         }
     })
     });
   }

 }

}
