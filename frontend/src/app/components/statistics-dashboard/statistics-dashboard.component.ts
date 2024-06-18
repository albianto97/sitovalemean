import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-statistics-dashboard',
  templateUrl: './statistics-dashboard.component.html',
  styleUrls: ['./statistics-dashboard.component.css']
})
export class StatisticsDashboardComponent {
  ordersAll: Order[] = [];
  ordersFiltered: Order[] = [];
  orderToShow: Order[] = [];
  countsArray = [];
  Movements: number[] = [];
  TotaleVendite: number = 0;
  TotaleProfitti: number = 0;
  TotaleSpese: number = 0;
  startDate?: string;
  endDate?: string;
  ready = false;
  isExpensesLoaded: boolean = false;
  isTotalLoaded: boolean = false;

  constructor(private orderService: OrderService, private stockService: StockService, private productService: ProductService) { }
  ngOnInit(): void {
    this.getStatistics();
  }
  getStatistics() {
    this.isExpensesLoaded = false;
    this.isTotalLoaded = false;
    this.getOrders();
    this.getMovements();
  }
  getMovements() {
    this.stockService.getStockExpensesGroupedByDate(this.startDate,this.endDate).subscribe((movimenti: any) => {

      this.Movements = movimenti.map((movimento: any) => movimento.totalExpenses);
      this.TotaleSpese = this.Movements.reduce((accumulatore, valoreCorrente) => accumulatore + valoreCorrente, 0);
      this.isExpensesLoaded = true;


    });
  }
  getOrders(): void {
    this.orderService.getOrdersForDate(this.startDate,this.endDate).subscribe((c: any) => {
      this.countsArray = c.map((obj: any) => obj.count);
    }, error => {
      console.error('Errore nella chiamata HTTP', error);
    });

    this.orderService.getTotalEarnings(this.startDate,this.endDate).subscribe((ordersWithPrice: any) => {
      this.TotaleVendite = ordersWithPrice.totalEarnings;
      this.isTotalLoaded = true;
    }, error => {
      console.error('Errore nella chiamata HTTP', error);
      this.isTotalLoaded = true;  // Anche in caso di errore, imposta la variabile a true per evitare un loop infinito.
    });

  }

  filterOrder() {

  }


}
