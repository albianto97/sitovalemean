import { Component, OnInit } from '@angular/core';
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
export class StatisticsDashboardComponent implements OnInit {
  ordersAll: Order[] = [];
  ordersFiltered: Order[] = [];
  orderToShow: Order[] = [];
  countsArray: number[] = [];
  Movements: number[] = [];
  TotaleVendite: number = 0;
  TotaleProfitti: number = 0;
  TotaleSpese: number = 0;
  startDate?: string;
  endDate?: string;
  ready = false;
  isExpensesLoaded: boolean = false;
  isTotalLoaded: boolean = false;
  topProducts: any[] = [];
  isTopProductsReady: boolean = false;
  averageProductsPerOrder: number = 0;
  averageOrderValue: number = 0;
  totNumeroOrdini: number = 0;

  constructor(
    private orderService: OrderService,
    private stockService: StockService,
    private productService: ProductService
  ) {}

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.getStatistics();
  }

  // Metodo per ottenere le statistiche
  getStatistics(): void {
    this.isExpensesLoaded = false;
    this.isTotalLoaded = false;
    this.isTopProductsReady = false;
    this.getTopProducts();
    this.getOrders();
    this.getMovements();
    this.getAverageProductsPerOrder();
    this.getAverageOrderValue();
  }

  // Metodo per ottenere la media dei prodotti per ordine
  getAverageProductsPerOrder(): void {
    this.orderService.getAverageProductsPerOrder(this.startDate, this.endDate).subscribe(
      (data: any) => {
        this.averageProductsPerOrder = data.averageProducts;
      },
      (error) => {
        console.error('Errore nel recupero della media dei prodotti per ordine:', error);
      }
    );
  }

  // Metodo per ottenere il valore medio degli ordini
  getAverageOrderValue(): void {
    this.orderService.getAverageOrderValue(this.startDate, this.endDate).subscribe(
      (data: any) => {
        this.averageOrderValue = data.averageOrderValue;
      },
      (error) => {
        console.error('Errore nel recupero del valore medio degli ordini:', error);
      }
    );
  }

  // Metodo per ottenere i prodotti migliori
  getTopProducts(): void {
    this.productService.getTopProducts(this.startDate, this.endDate).subscribe(
      (data: any) => {
        const all = data.map((product: any) => ({ labels: product.name, values: product.totalQuantity }));
        this.topProducts = all.reduce((acc: any, curr: any) => {
          acc.labels.push(curr.labels);
          acc.values.push(curr.values);
          return acc;
        }, { labels: [], values: [] });
        this.isTopProductsReady = true;
      },
      (error) => {
        this.isTopProductsReady = true;
        const message = "Errore nel recupero dei top Products";
        console.error(message, error);
      }
    );
  }

  // Metodo per ottenere i movimenti di magazzino
  getMovements(): void {
    this.stockService.getStockExpensesGroupedByDate(this.startDate, this.endDate).subscribe(
      (movimenti: any) => {
        this.Movements = movimenti.map((movimento: any) => movimento.totalExpenses);
        this.TotaleSpese = this.Movements.reduce((accumulatore, valoreCorrente) => accumulatore + valoreCorrente, 0);
        this.isExpensesLoaded = true;
      },
      (error) => {
        console.error('Errore nel recupero dei movimenti di magazzino:', error);
        this.isExpensesLoaded = true;
      }
    );
  }

  // Metodo per ottenere gli ordini
  getOrders(): void {
    this.orderService.getOrdersForDate(this.startDate, this.endDate).subscribe(
      (c: any) => {
        this.countsArray = c.map((obj: any) => obj.count);
        this.totNumeroOrdini = this.countsArray.reduce((accumulatore, valoreCorrente) => accumulatore + valoreCorrente, 0);
      },
      (error) => {
        console.error('Errore nel recupero degli ordini:', error);
      }
    );

    this.orderService.getTotalEarnings(this.startDate, this.endDate).subscribe(
      (ordersWithPrice: any) => {
        this.TotaleVendite = ordersWithPrice.totalEarnings;
        this.isTotalLoaded = true;
      },
      (error) => {
        console.error('Errore nel recupero delle vendite totali:', error);
        this.isTotalLoaded = true;
      }
    );
  }
}
