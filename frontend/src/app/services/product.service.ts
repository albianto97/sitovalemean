import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Product} from "../models/product";
import {Observable} from "rxjs";
import {GeneralService} from "./-general.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  endPoint = "http://localhost:3000/api/product";

  constructor(private http: HttpClient, private generalService: GeneralService) { }
  public createProduct(product: Product):any {
    return this.http.post(this.endPoint + "/create-product", product);
  }
  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.endPoint);
  }


  // product.service.ts
  public getSingleProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.endPoint}/${productId}`);
  }


}
