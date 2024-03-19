import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, Status } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {
  order: any;
  orderStates: string[] = [];
  products:any[]= [];
  isAdmin:boolean = false;
  constructor(private route: ActivatedRoute, private productService: ProductService,public authService:AuthService) { }
  ngOnInit(): void {
    const state = history.state;
    if (state && state.order) {
      this.order = state.order;
    }
    console.log(this.order);
    let productIds = this.order.products.map((product:any) => product.productId);
    this.productService.getProductsById(productIds).subscribe((p: Product[]) =>{
      if(this.order) {
        for (let i = 0; i < p.length; i++) {
          this.products.push(<Product>Object.assign({}, this.order.products[i], p[i]));
          //delete this.order.products[i].productId;
        }
       
      }
  })
    this.orderStates = Object.keys(Status);
    
  }
  
}
