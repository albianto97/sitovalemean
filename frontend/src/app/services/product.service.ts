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
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.post(this.endPoint + "/create-product", product, {headers});
  }
  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.endPoint);
  }

  public getProductsById(productIds: String[]): Observable<Product[]> {
    return this.http.post<Product[]>(this.endPoint + "/getProductsById", productIds);
  }
  getTopProducts(startDate?: string, endDate?: string) {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get(`${this.endPoint}/getTopProducts${queryParams}`, {headers});
  }
  // product.service.ts
  public getSingleProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.endPoint}/${productId}`);
  }

  public removeOneFromProductQuantity(productId: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put<any>(`${this.endPoint}/${productId}/decrement`, {},{headers});
  }

  addQuantityToProduct(productId: string, quantityToAdd: number) {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put<any>(`${this.endPoint}/${productId}/increment`, { quantityToAdd },{headers});
  }

  quantity0(productId: string) {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put<any>(`${this.endPoint}/${productId}/zero`, {}, {headers});
  }
  deleteProduct(productId: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.delete<any>(`${this.endPoint}/${productId}`, { headers });
  }

  updateProductDescription(productId: string, description: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put<any>(`${this.endPoint}/${productId}/updateDescription`,{ description }, { headers });
  }
}
