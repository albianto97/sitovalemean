import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './-general.service';
import { Observable } from 'rxjs';
import { Order } from "../models/order";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  endPoint = environment.apiUrl + "/order"; // URL del server API per gli ordini

  constructor(private http: HttpClient, private generalService: GeneralService) { }

  // Metodo per ottenere gli ordini di un utente
  getOrdersFromUser(): Observable<Order[]> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.get<Order[]>(`${this.endPoint}/getOrdersFromUser`, { headers });
  }

  // Metodo per ottenere il numero medio di prodotti per ordine in un intervallo di date
  getAverageProductsPerOrder(startDate?: string, endDate?: string): Observable<any> {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get(`${this.endPoint}/getAverageProductsPerOrder${queryParams}`, { headers });
  }

  // Metodo per ottenere il valore medio degli ordini in un intervallo di date
  getAverageOrderValue(startDate?: string, endDate?: string): Observable<any> {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get(`${this.endPoint}/getAverageOrderValue${queryParams}`, { headers });
  }

  // Metodo per ottenere gli ordini dei prodotti di un utente
  getOrderOfUserProduct(): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get(`${this.endPoint}/getOrderOfUserProduct`, { headers });
  }

  // Metodo per creare un nuovo ordine
  createOrder(order: any): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.post(`${this.endPoint}/create-order`, order, { headers });
  }

  // Metodo per ottenere tutti gli ordini
  getAllOrders(): Observable<Order[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<Order[]>(`${this.endPoint}/getAllOrders`, { headers });
  }

  // Metodo per cercare ordini per nome utente e stato
  searchOrderByUsername(username: string, status: string): Observable<Order[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    let s = status ? status : "";
    return this.http.get<Order[]>(`${this.endPoint}/searchOrdersByUsername?username=${username}&status=${s}`, { headers });
  }

  // Metodo per ottenere un ordine specifico per ID
  getOrder(orderId: string): Observable<Order> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<Order>(`${this.endPoint}/${orderId}`, { headers });
  }

  // Metodo per ottenere gli ordini in un intervallo di date
  getOrdersForDate(startDate?: string, endDate?: string): Observable<any> {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<Order>(`${this.endPoint}/getOrdersForDate${queryParams}`, { headers });
  }

  // Metodo per ottenere i guadagni totali in un intervallo di date
  getTotalEarnings(startDate?: string, endDate?: string): Observable<any> {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<Order>(`${this.endPoint}/getTotalEarnings${queryParams}`, { headers });
  }

  // Metodo per aggiornare un ordine
  updateOrder(order: Order): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put(`${this.endPoint}/update`, order, { headers });
  }
}
