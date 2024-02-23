import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './-general.service';
import {Observable} from "rxjs";
import {User} from "../models/user";
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
    return this.http.post(this.endPoint + '/create-order', order);
  }


  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.endPoint+'/getAllOrders');
  }

  searchOrderByUsername(username : string, status: string): Observable<Order[]> {
    let s = status ? status : "";
    return this.http.get<Order[]>(this.endPoint+'/searchOrdersByUsername?username='+username+"&status="+s );

  }

}
