import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Stock } from 'src/app/models/stock';
import { RawIngridientService } from 'src/app/services/raw-ingridient.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css'
})
export class StockListComponent implements OnInit {
  stocks: any[] = [];
  allStocks: any[] = [];
  allIngredients: any[] = []
  startDate?: string;
  endDate?: string;
 // per gestire il paginator
 pageEvent: PageEvent | undefined;
 length = 50;
 pageSize = 10;
 pageIndex = 0;
 pageSizeOptions = [10, 25, 50];
  constructor(private stockService: StockService, private ingredientService: RawIngridientService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
    
    this.ingredientService.getIngredients().subscribe((ingredients: any) => {
      this.allIngredients = ingredients;
      this.getStocks();
    })
    // Carica tutti i movimenti all'inizio

  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    
    this.setStocksVariable();

  }
  setStocksVariable(){
    let elementi = this.pageSize


    if ((this.pageIndex + 1) * this.pageSize > this.allStocks.length) {
      elementi = (this.allStocks.length - this.pageIndex * this.pageSize)

    }
    console.log(elementi, this.pageIndex * this.pageSize, elementi);

    this.stocks = this.allStocks.slice(this.pageIndex * this.pageSize, (this.pageIndex * this.pageSize) + elementi)
  }
  reciveMovimento(eseguito:boolean){
    if(eseguito)
      this.getStocks();
  }
  getStocks(): void {
    this.stockService.getStocks(this.startDate, this.endDate).subscribe(
      data => {
        this.allStocks = data;
        this.setStocksVariable();
        console.log(data);
        
        this.stocks.forEach((stock:any)=>{
          const ingredient = this.allIngredients.find(ingredient => ingredient._id === stock.ingredientId);
          stock.ingredient = ingredient;
        })
        console.log(this.stocks);
        
      },
      error => {
        const message = 'Errore nel recupero dei movimenti';
        console.error(message, error);
        this._snackBar.open(message, 'Chiudi', {
          duration: 5 * 1000,
        });
      }
    );
  }
}