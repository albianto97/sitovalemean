import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from "../../models/user";
import { AuthService } from "../../services/auth.service";
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { OrderService } from "../../services/order.service";
import { Order } from "../../models/order";
import { MatPaginator } from "@angular/material/paginator";

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

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService
  ) {
    // Recupera i prodotti migliori
    this.orderService.getOrderOfUserProduct().subscribe(
      (response: any) => {
        this.bestProducts = response.bestProducts.splice(0, 3);
      },
      (error) => {
        console.error('Errore nel recupero dei migliori prodotti:', error);
      }
    );
  }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.user = this.authService.getUserFromToken();
    if (this.user) {
      this.username = this.user.username;
      this.filterData();
    }
  }

  // Metodo per ottenere i top prodotti
  getTopProducts() {
    this.productService.getTopProducts().subscribe(
      (data: any) => {
        this.topProducts = data;
      },
      (error) => {
        const message = "Errore nel recupero dei top Products";
        console.error(message, error);
      }
    );
  }

  // Metodo per gestire il cambio di pagina del paginator
  onPageChange(event: any): void {
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.myOrdersView = this.myOrdersTotal.slice(this.startIndex, this.endIndex);
  }

  // Metodo per gestire il cambio di filtro
  filterChange(): void {
    this.startIndex = 0;
    this.endIndex = this.pageSize;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.filterData();
  }

  // Metodo per filtrare i dati
  filterData(): void {
    this.orderService.searchOrderByUsername(this.username, this.selectedOrderStatus).subscribe(
      (orders) => {
        this.myOrdersTotal = orders;
        this.myOrdersView = orders.slice(this.startIndex, this.endIndex);
      },
      (error) => {
        console.error('Errore nel filtrare i dati degli ordini:', error);
      }
    );
  }
}
