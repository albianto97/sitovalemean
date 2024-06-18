import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './-general.service';
import { Ingredient } from '../models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class RawIngridientService {
  private apiUrl = 'http://localhost:3000/api/rawIngredients';
  constructor(private http: HttpClient, private generalService: GeneralService) {}

  getIngredients() {
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.get(this.apiUrl+'/getIngredients', { headers });
  }

  addIngredient( ingredient: Ingredient) {
    console.log(ingredient);
    
    const headers = this.generalService.createHeadersForAuthorization();
    return this.http.post(this.apiUrl+'/insertIngredient', ingredient, { headers });
  }
}
