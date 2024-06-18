import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock';
import { GeneralService } from './-general.service';


@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:3000/api/stock';

  constructor(private http: HttpClient, private generalService: GeneralService) {}

  getStocks(startDate?: string, endDate?: string): Observable<Stock[]> {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<Stock[]>(`${this.apiUrl}/getStockMovements${queryParams}`, {headers});
  }
  getStockExpensesGroupedByDate(startDate?: string, endDate?: string): Observable<Stock[]> {
    let queryParams = '';

    if (startDate && endDate) {
      queryParams = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get<Stock[]>(`${this.apiUrl}/getStockExpensesGroupedByDate${queryParams}`, {headers});
  }

  addStock(stock: Stock): Observable<Stock> {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.post<Stock>(this.apiUrl+'/insertStockMovements', stock, {headers});
  }
}
