import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Ingredient } from 'src/app/models/ingredient';
import { RawIngridientService } from 'src/app/services/raw-ingridient.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  token: string | null = null;
  ingredients: any[] = [];
  allIngredients: any[] = [];
  ingredientForm: FormGroup;

  // Variabili per gestire il paginator
  pageEvent: PageEvent | undefined;
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50];

  constructor(
    private ingredientService: RawIngridientService,
    private fb: FormBuilder
  ) {
    // Inizializza il form degli ingredienti con validazione
    this.ingredientForm = this.fb.group({
      name: ['', Validators.required],
      disponibilty: [0, [Validators.required, Validators.min(0)]],
      meauserement: ['', Validators.required],
      mediumPrice: ['', [Validators.required, Validators.min(0)]]
    });
  }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.getIngredients();
  }

  // Metodo per gestire gli eventi del paginator
  handlePageEvent(e: PageEvent): void {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.setIngredientsVariable();
  }

  // Metodo per ottenere tutti gli ingredienti
  getIngredients(): void {
    this.ingredientService.getIngredients().subscribe(
      (data: any) => {
        this.allIngredients = data;
        this.setIngredientsVariable();
      },
      (error) => {
        console.error('Errore nel recupero degli ingredienti:', error);
      }
    );
  }

  // Metodo per impostare le variabili degli ingredienti per il paginator
  setIngredientsVariable(): void {
    let elementi = this.pageSize;

    if ((this.pageIndex + 1) * this.pageSize > this.allIngredients.length) {
      elementi = (this.allIngredients.length - this.pageIndex * this.pageSize);
    }

    this.ingredients = this.allIngredients.slice(this.pageIndex * this.pageSize, (this.pageIndex * this.pageSize) + elementi);
  }

  // Metodo chiamato al submit del form
  onSubmit(): void {
    if (this.ingredientForm.valid) {
      const newIngredient: Ingredient = this.ingredientForm.value;

      this.ingredientService.addIngredient(newIngredient).subscribe(
        (response) => {
          this.getIngredients(); // Ricarica gli ingredienti dopo l'aggiunta
          this.resetForm();
        },
        (error) => {
          console.error('Errore durante l\'aggiunta dell\'ingrediente:', error);
        }
      );
    }
  }

  // Metodo per resettare il form degli ingredienti
  private resetForm(): void {
    this.ingredientForm.reset({
      name: ['', Validators.required],
      disponibilty: [0, [Validators.required, Validators.min(0)]],
      meauserement: ['', Validators.required],
      mediumPrice: ['', [Validators.required, Validators.min(0)]]
    });
  }
}
