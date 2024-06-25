import {Component, OnInit, ViewChild} from '@angular/core';
import { User } from "../../models/user";
import { AuthService } from "../../services/auth.service";
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { OrderService } from "../../services/order.service";
import { Order } from "../../models/order";
import { SocketService } from "../../services/socket.service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfiloComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  user: User | undefined;
  username: string = '';
  bestProducts: Product[] = [];
  myOrdersTotal: Order[] = [];
  myOrdersView: Order[] = [];
  pageSize: number = 3;
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = 3;
  selectedOrderStatus: string = 'inAttesa'; // Valore predefinito del filtro
 topProducts: any[] = [];
  constructor(private authService: AuthService, private productService: ProductService, private orderService: OrderService) {
    orderService.getOrderOfUserProduct().subscribe((response: any) => {
      console.log(response);
      this.bestProducts = response.bestProducts.splice(0, 3);
    });

  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromToken();
    this.username = this.authService.getUserFromToken().username;
    this.filterData();
  }
  getTopProducts(){
    this.productService.getTopProducts().subscribe((data:any) =>{
      
      this.topProducts =  data;
       
     }, error => {
       
       const message = "Errore nel recupero dei top Products";
       console.error(message, error);
       
     })
  }

  /*loadOrders(): void {
    this.orderService.getOrdersFromUser().subscribe((oldOrders: any) => {
      console.log(oldOrders);
      this.myOrdersTotal = oldOrders;
      this.myOrdersView = oldOrders.slice(this.startIndex, this.endIndex);
    });
  }*/

  onPageChange(event: any): void {
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    // Aggiorna myOrdersView con la porzione corretta degli ordini
    this.myOrdersView = this.myOrdersTotal.slice(this.startIndex, this.endIndex);
  }
  filterChange(): void{
    this.startIndex = 0;
    this.endIndex = this.pageSize;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.filterData();
  }

  filterData(): void {
    this.orderService.searchOrderByUsername(this.username, this.selectedOrderStatus).subscribe(orders => {
      this.myOrdersView = orders;
      console.log(this.myOrdersView);
      this.myOrdersTotal = orders;
      this.myOrdersView = orders.slice(this.startIndex, this.endIndex);
    });
  }
}
