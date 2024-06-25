import { Component, OnInit } from '@angular/core';
import { Order, OrderType } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from "@angular/router";
import { Product } from "../../../models/product";
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from '../../dialogs/dialog-alert/dialog-alert.component';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  productsInCart: any[] = [];
  productsNotDispo: Product[] = [];
  user: any | undefined;
  order: Order | null = null;
  // per creare dinamicamente la select della tipologia del'ordine
  orderTypes = Object.entries(OrderType).map(([key, value]) => ({ key, value }));
  selectedOrderType: string = 'ritiro';

  note: string | null = null;
  constructor(private router: Router, private orderService: OrderService,
    private productService: ProductService, private cartService: CartService,
    private authService: AuthService, private dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      data: {
        titolo: 'Conferma Ordine',
        descrizione: 'Stai per inoltrare l\'ordine. Vuoi confermare l\'ordine?',
        btn1: 'Conferma Ordine',
        btn2: 'Annulla'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.creaOrdine();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUserFromToken();
    if (!this.user) {
      this.router.navigate(['login']);
    }
    this.productsInCart = this.cartService.getCart().products;
    // sono nella fase finale dell'ordine devo accorgermi se sono disponibili tutti i prodotti
    this.checkDispoProducts();

  }

  // assegno il valore digitato nella text-area ad una variabile
  handleInputTextArea(ev: any) {
    this.note = ev.target.value
  }
  async checkDispoProducts() {
    this.productsNotDispo = [];
    try {
      for (const product of this.productsInCart) {
        const productToCheck = await this.productService.getSingleProduct(product.productId).toPromise();
        if (productToCheck) {
          if (productToCheck.disponibilita! < product.quantity) {
            this.productsNotDispo.push(productToCheck);
          }
        }
      }
    } catch (error) {
      console.error('Errore:', error);
    }
  }
  creaOrdine() {
    // Verifica se il carrello contiene almeno un prodotto
    if (this.productsInCart.length == 0) {
      // Messaggio di avviso o azione da eseguire quando il carrello è vuoto
      console.log("Impossibile creare un ordine perché il carrello è vuoto.");
      return;
    }

    if (this.user) {
      const order = {
        creationDate: new Date(),
        closingDate: null,
        shippingDate: null,
        status: 'inAttesa',
        note: this.note,
        orderType: this.selectedOrderType,
        products: this.productsInCart,
        user: this.user._id
      };
      // da controllare prima se tutti i prodotti sono disponibili! 
      this.orderService.createOrder(order).subscribe((result: any) => {
        console.log(result, order);
        if (result.result == 1) {
          let productString = result.products.map((p: Product) => p.name).join(", ");
          alert("Impossibile, prodotti non disponibili: " + productString + "\nVerranno rimossi dal carrello!");
          for (let i = 0; i < result.products.length; i++) {
            this.cartService.removeProduct(result.products[i]._id);
          }
          this.router.navigate(["/view-cart"]);
        } else {
          this.cartService.emptyCart();
          this.router.navigate(['/profilo']);
        }
      });
    } else {
      // Deve effettuare il login per poter effettuare l'ordine
    }
  }
}
