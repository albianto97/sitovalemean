import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/reservations';

  constructor(private http: HttpClient) {}

  getMyReservations(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/my`);
  }

  addProduct(productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/${productId}`, {});
  }

  removeProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`);
  }

  clearReservations(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`);
  }
}
