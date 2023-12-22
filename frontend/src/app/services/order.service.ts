import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class OrderService {
  endPoint = "http://localhost:3000/api/order";

  constructor(private http: HttpClient) { }
  createOrder(order: any) {
    return this.http.post(this.endPoint+'/create-order', order);
  }

}
