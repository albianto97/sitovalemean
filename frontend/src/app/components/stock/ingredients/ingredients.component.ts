import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  ingredientForm: FormGroup;

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
  getIngredients() {
  
      this.ingredientService.getIngredients().subscribe((data:any) => {
        console.log(data);
        
        this.ingredients = data;
      });
    
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
