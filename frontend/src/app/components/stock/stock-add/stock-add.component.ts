import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ingredient } from 'src/app/models/ingredient';
import { Stock } from 'src/app/models/stock';
import { RawIngridientService } from 'src/app/services/raw-ingridient.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-add',
  templateUrl: './stock-add.component.html',
  styleUrl: './stock-add.component.css'
})
export class StockAddComponent implements OnInit {
  @Output() sendMovimento: EventEmitter<boolean> = new EventEmitter<boolean>();
  ingredientId: string = '';
  movementQuantity: number = 0;
  typeMovement: 'load' | 'unload' = 'load';
  price: number = 0;
  insertDate: string = '';
  ingredients: Ingredient[] = [];
  isIngredientsAreLoad: boolean = false;
  isInError: boolean = false;



  constructor(private stockService: StockService, private ingredientService: RawIngridientService,
    private _snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
    this.setDateToToday();
    this.ingredientService.getIngredients().subscribe((data: any) => {
      this.ingredients = data;
      this.isIngredientsAreLoad = true;
    },
      (error: any) => {
        const message = 'Errore durante il recupero degli ingredienti';

        this._snackBar.open(message, 'Chiudi', {
          duration: 5 * 1000,
        });
        console.error(message, error);
        this.isIngredientsAreLoad = true;
        this.isInError = true;
        // Gestisci l'errore qui, ad esempio impostando un flag per mostrare un messaggio d'errore nell'interfaccia utente
      }
    );
  }
  setDateToToday(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Mesi da 0 a 11
    const day = ('0' + today.getDate()).slice(-2);

    this.insertDate = `${year}-${month}-${day}`;
  }
  setPrice() {
    const ingredient = this.ingredients.find(ingredient => ingredient._id === this.ingredientId);
    console.log(ingredient);
    if (ingredient) {
      this.price = parseFloat((ingredient.mediumPrice * this.movementQuantity).toFixed(2));
    }

  }
  addStock(): void {
    const newStock: Stock = {
      ingredientId: this.ingredientId,
      movementQuantity: this.movementQuantity,
      typeMovement: this.typeMovement,
      price: this.price,
      insertDate: this.insertDate
    };

    this.stockService.addStock(newStock).subscribe(
      () => {
        console.log('Movimento aggiunto con successo');
        this.sendMovimento.emit(true);
      },
      error => {
        this.sendMovimento.emit(false);
        console.error('Errore nell\'aggiunta del movimento:', error);
      }
    );
  }
}
