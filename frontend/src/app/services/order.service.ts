import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './-general.service';



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
  getOrderOfUserProduct() {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get(this.endPoint+'/getOrderOfUserProduct', { headers });

  }

  createOrder(order: any) {
    return this.http.post(this.endPoint + '/create-order', order);
  }

}
