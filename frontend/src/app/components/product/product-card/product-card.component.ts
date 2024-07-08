import {Component, Input, Output, EventEmitter} from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import {AuthService} from "../../../services/auth.service";
import {ProductService} from "../../../services/product.service";
import {Router} from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { DialogConfermaComponent } from '../../structure/dialog-conferma/dialog-conferma.component';
import {EditDescriptionDialogComponent} from "../../structure/edit-description-dialog/edit-description-dialog.component";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: any;
  @Input() isViewCarrello: boolean = false;
  @Input() showDeleteButton: boolean = false;
  @Output() itemRemoved = new EventEmitter();
  isAdmin: boolean = false;
  quantityToAdd: any;
  @Input() singleP: boolean = false;

  constructor(public cartService: CartService,
              private authService: AuthService,
              private productService: ProductService,
              private route: Router,
            private dialog: MatDialog) {}

  ngOnInit(): void {
    console.log(this.product);

    let itemId = this.product._id;
    let quantity = this.cartService.getQuantityByProductId(itemId);
    this.product.cartQuantity = quantity;
    this.quantityToAdd = 0;
    this.isAdmin = this.authService.isAdmin();
  }

  // Metodo per aprire il dialogo di modifica della descrizione
  openEditDescriptionDialog(): void {
    const dialogRef = this.dialog.open(EditDescriptionDialogComponent, {
      width: '400px',
      data: {
        description: this.product.description,
        type: "strong_warning",
        message: "Confermi di voler aggiornare la descrizione del prodotto: '" + this.product.name + "'?",
        secondaryMessage: "La nuova descrizione sostituirà quella esistente."
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.productService.updateProductDescription(this.product._id, result)
          .subscribe(() => {
            this.product.description = result; // Aggiorna la descrizione nel componente
            alert('Descrizione aggiornata con successo!');
          });
      }
    });
  }



  addItemToCart(itemId: string) {
    let quantity = this.cartService.getQuantityByProductId(itemId);
    let p: any = this.product;
    if(quantity < p.disponibilita) {
      this.cartService.addToCart(itemId, 1);
      (<any>this.product).cartQuantity++;
    }
    else{
      alert("Disponibilià esaurita: Non è possibile inserire questo prodotto nel carrello");
    }
  }

  removeProduct(){
    this.cartService.removeProduct(this.product._id)
    this.itemRemoved.emit();
  }

  addToQuantity(qta: number) {
    if (!this.quantityToAdd)
      this.quantityToAdd = qta;
    else
      this.quantityToAdd += qta;
  }

  aggiornaQta(){
    this.productService.addQuantityToProduct(this.product._id, this.quantityToAdd).subscribe(() => {
      this.product.disponibilita += this.quantityToAdd;
    });
  }

  removeOneFromQuantity(productId: string) {
    this.productService.removeOneFromProductQuantity(productId).subscribe((response) => {
      if(this.product.disponibilita) this.product.disponibilita--;
    });
  }

  quantity0(productId: string) {
    this.dialog.open(DialogConfermaComponent,{
      data: {
        type: "strong_warning",
        message: "Confermi di voler portare a 0 la quantita di: '" + this.product.name + "'",
        secondaryMessage: "Nel negozio non risulterà disponibile"
      }
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.productService.quantity0(productId).subscribe((response) => {
          if(this.product.disponibilita) this.product.disponibilita = 0;
        });
      }
    });
  }

  deleteProduct() {
    this.dialog.open(DialogConfermaComponent,{
      data: {
        type: "strong_warning",
        message: "Confermi di voler Eliminare il prodotto: '" + this.product.name + "'",
        secondaryMessage: "Verranno eliminate tutte le informazioni."
      }
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.productService.deleteProduct(this.product._id).subscribe(r => {
          if(r.result == 0) {
            alert('Prodotto eliminato con successo');
            console.log('Prodotto eliminato con successo');
          } else if(r.result == 2) {
            alert('Prodotto presente in qualche ordine, evitiamo di sballare i grafici');
          }
          this.route.navigate(['/productList']);
        });
      }
    });
  }
}
