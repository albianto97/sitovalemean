import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, Status } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {
  order: any;
  orderStates: string[] = [];
  orderedProducts: any[] = [];
  isTableMode: boolean = false;
  isAdmin: boolean = false;
  total: any = {
    totQuantity: 0,
    totPrice: 0
  }
  constructor(private route: ActivatedRoute, private productService: ProductService, private orderService: OrderService,
    public authService: AuthService) { }
  ngOnInit(): void {
    // passo l'ordine dal router
    const state = history.state;
    if (state && state.order) {
      const orderId = state.order._id;
      this.orderService.getOrder(orderId).subscribe(orderFromDb => {
        this.order = orderFromDb;
        // prendo tutti gli id dei prodotti presenti nell'ordine
        let productIds = this.order.products.map((product: any) => product.productId);
        // creo la lista dei prodotti
        this.productService.getProductsById(productIds).subscribe((p: Product[]) => {
          for (let i = 0; i < p.length; i++) {
            var orderedProduct = Object.assign({}, this.order.products[i], p[i])
            this.orderedProducts.push(orderedProduct);
            this.total.totQuantity += orderedProduct.quantity;
            this.total.totPrice += orderedProduct.quantity * orderedProduct.price;
          }
        })
      })

    }

    this.orderStates = Object.keys(Status);
  }
  updateOrder() {
    console.log(this.order);

    if (this.order.status == "terminato")
      this.order.closingDate = new Date();
    if (this.order.status == "consegnato") {
      if (this.order.closingDate == null)
        this.order.closingDate = new Date();
      this.order.shippingDate = new Date();
    }
    console.log("CIAO", this.order);

    this.orderService.updateOrder(this.order).subscribe(result => {
      console.log(result);
      history.state.order = result;
    })
  }


}
