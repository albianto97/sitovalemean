import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './-general.service';
import {Observable} from "rxjs";
import {Order} from "../models/order";



@Injectable({
  providedIn: 'root'
})
export class OrderService {
  endPoint = "http://localhost:3000/api/order";

  constructor(private http: HttpClient, private generalService: GeneralService) { }
  getOrdersFromUser() {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get(this.endPoint+'/getOrdersFromUser', { headers });
  }
  /*getOrdersFromUser(user: any) {
    return this.http.get(this.endPoint+'/getOrdersFromUser',  user );
  }*/
  getOrderOfUserProduct() {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get(this.endPoint+'/getOrderOfUserProduct', { headers });

  }

  createOrder(order: any) {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.post(this.endPoint + '/create-order', order, {headers});
  }


  public getAllOrders(): Observable<Order[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<Order[]>(this.endPoint+'/getAllOrders', {headers});
  }

  searchOrderByUsername(username : string, status: string): Observable<Order[]> {
    const headers = this.generalService.createHeadersForAuthorization();
    let s = status ? status : "";
    return this.http.get<Order[]>(this.endPoint+'/searchOrdersByUsername?username='+username+"&status="+s, {headers});
  }

  getOrder(orderId: string): Observable<Order>{
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<Order>(this.endPoint+'/'+ orderId, {headers});
  }

}
