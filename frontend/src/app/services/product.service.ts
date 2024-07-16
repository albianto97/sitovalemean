import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from "../models/product";
import { Observable } from "rxjs";
import { GeneralService } from "./-general.service";
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  endPoint = environment.apiUrl + "/product"; // URL del server API per i prodotti

  constructor(private http: HttpClient, private generalService: GeneralService) { }

  // Metodo per creare un nuovo prodotto
  public createProduct(product: Product): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization(); // Crea le intestazioni per l'autorizzazione
    return this.http.post(this.endPoint + "/create-product", product, { headers });
  }

  // Metodo per ottenere tutti i prodotti
  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.endPoint);
  }

  // Metodo per ottenere prodotti specifici per ID
  public getProductsById(productIds: String[]): Observable<Product[]> {
    return this.http.post<Product[]>(this.endPoint + "/getProductsById", productIds);
  }

  // Metodo per ottenere i prodotti migliori in un intervallo di date
  getTopProducts(startDate?: string, endDate?: string): Observable<any> {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get(`${this.endPoint}/getTopProducts${queryParams}`, { headers });
  }

  // Metodo per ottenere un singolo prodotto per ID
  public getSingleProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.endPoint}/${productId}`);
  }

  // Metodo per decrementare la quantità di un prodotto
  public removeOneFromProductQuantity(productId: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put<any>(`${this.endPoint}/${productId}/decrement`, {}, { headers });
  }

  // Metodo per aggiungere una quantità specifica a un prodotto
  addQuantityToProduct(productId: string, quantityToAdd: number): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put<any>(`${this.endPoint}/${productId}/increment`, { quantityToAdd }, { headers });
  }

  // Metodo per impostare la quantità di un prodotto a zero
  quantity0(productId: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put<any>(`${this.endPoint}/${productId}/zero`, {}, { headers });
  }

  // Metodo per eliminare un prodotto
  deleteProduct(productId: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.delete<any>(`${this.endPoint}/${productId}`, { headers });
  }

  // Metodo per aggiornare la descrizione di un prodotto
  updateProductDescription(productId: string, description: string): Observable<any> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.put<any>(`${this.endPoint}/${productId}/updateDescription`, { description }, { headers });
  }
}
