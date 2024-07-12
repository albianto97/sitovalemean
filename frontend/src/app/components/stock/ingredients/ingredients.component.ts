import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Ingredient } from 'src/app/models/ingredient';
import { RawIngridientService } from 'src/app/services/raw-ingridient.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.css'
})
export class IngredientsComponent implements OnInit {
  token: string | null = null;
  ingredients: any[] = [];
  allIngredients: any[] = [];
  ingredientForm: FormGroup;
 // per gestire il paginator
 pageEvent: PageEvent | undefined;
 length = 50;
 pageSize = 10;
 pageIndex = 0;
 pageSizeOptions = [10, 25, 50];
  constructor(
    private ingredientService: RawIngridientService,
    private fb: FormBuilder
  ) {
    this.ingredientForm = this.fb.group({
      name: ['', Validators.required],
      disponibilty: [0, [Validators.required, Validators.min(0)]],
      meauserement: ['', Validators.required],
      mediumPrice: ['', [Validators.required, Validators.min(0)]]
    });
  }
  ngOnInit(): void {
    this.getIngredients();
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    
    this.setIngredientsVariable();

  }
  getIngredients() {
  
      this.ingredientService.getIngredients().subscribe((data:any) => {
        console.log(data);
        
        this.allIngredients = data;
        this.setIngredientsVariable()
      });
    
  }
  setIngredientsVariable(){
    let elementi = this.pageSize


    if ((this.pageIndex + 1) * this.pageSize > this.allIngredients.length) {
      elementi = (this.allIngredients.length - this.pageIndex * this.pageSize)

    }
    console.log(elementi, this.pageIndex * this.pageSize, elementi);

    this.ingredients = this.allIngredients.slice(this.pageIndex * this.pageSize, (this.pageIndex * this.pageSize) + elementi)
  }
  onSubmit() {
    if ( this.ingredientForm.valid) {
      const newIngredient: Ingredient = this.ingredientForm.value;
      console.log(newIngredient);
      
      this.ingredientService.addIngredient(newIngredient).subscribe(response => {
        console.log('Ingredient added:', response);
        this.getIngredients(); // Ricarica gli ingredienti dopo l'aggiunta
        this.ingredientForm = this.fb.group({
          name: ['', Validators.required],
          disponibilty: [0, [Validators.required, Validators.min(0)]],
          meauserement: ['', Validators.required],
          mediumPrice: ['', [Validators.required, Validators.min(0)]]
        });
      });
    }
  }
}
