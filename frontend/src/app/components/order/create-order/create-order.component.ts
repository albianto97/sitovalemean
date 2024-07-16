import { Component, OnInit } from '@angular/core';
import { Order, OrderType } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertComponent } from 'src/app/components/dialogs/dialog-alert/dialog-alert.component';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  productsInCart: any[] = [];
  productsNotDispo: Product[] = [];
  user: any | undefined;
  order: any = {}; // Inizializza con un oggetto vuoto
  isOrderLoaded = false;
  orderTypes = Object.entries(OrderType).map(([key, value]) => ({ key, value }));
  selectedOrderType: string = 'ritiro';
  note: string | null = null;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.initializeComponent();
  }

  // Metodo per inizializzare il componente
  async initializeComponent(): Promise<void> {
    try {
      this.user = await this.authService.getUserFromToken();
      if (!this.user) {
        this.router.navigate(['login']);
        return;
      }

      this.productsInCart = this.cartService.getCart().products;
      this.createOrderObject();
      this.isOrderLoaded = true;
      await this.checkDispoProducts();
    } catch (error) {
      console.error('Errore durante l\'inizializzazione del componente:', error);
    }
  }

  // Metodo per creare l'oggetto ordine
  createOrderObject(): void {
    this.order = {
      creationDate: null,
      closingDate: null,
      shippingDate: null,
      status: 'inAttesa',
      note: this.note,
      orderType: this.selectedOrderType,
      products: this.productsInCart,
      user: this.user._id
    };
  }

  // Metodo per aprire il dialog di conferma ordine
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      data: {
        titolo: 'Conferma Ordine',
        descrizione: 'Stai per inoltrare l\'ordine. Vuoi confermare l\'ordine?',
        btn1: 'Conferma Ordine',
        btn2: 'Annulla'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.creaOrdine();
      }
    });
  }

  // Metodo per gestire l'input della textarea
  handleInputTextArea(ev: any): void {
    this.note = ev.target.value;
    this.createOrderObject();
  }

  // Metodo per verificare la disponibilità dei prodotti
  async checkDispoProducts(): Promise<void> {
    this.productsNotDispo = [];
    try {
      for (const product of this.productsInCart) {
        const productToCheck = await this.productService.getSingleProduct(product.productId).toPromise();
        if (productToCheck && productToCheck.disponibilita! < product.quantity) {
          this.productsNotDispo.push(productToCheck);
        }
      }
    } catch (error) {
      console.error('Errore durante la verifica della disponibilità dei prodotti:', error);
    }
  }

  // Metodo per creare l'ordine
  creaOrdine(): void {
    if (this.productsInCart.length === 0) {
      console.log("Impossibile creare un ordine perché il carrello è vuoto.");
      return;
    }

    if (this.user) {
      const order = {
        ...this.order,
        creationDate: new Date()
      };

      this.orderService.createOrder(order).subscribe(
        (result: any) => {
          if (result.result === 1) {
            this.handleUnavailableProducts(result.products);
          } else {
            this.cartService.emptyCart();
            this.router.navigate(['/profilo']);
          }
        },
        (error: any) => {
          console.error('Errore durante la creazione dell\'ordine:', error);
        }
      );
    } else {
      console.log("Deve effettuare il login per poter effettuare l'ordine");
    }
  }

  // Metodo per gestire i prodotti non disponibili
  handleUnavailableProducts(products: Product[]): void {
    let productString = products.map((p: Product) => p.name).join(", ");
    alert("Impossibile, prodotti non disponibili: " + productString + "\nVerranno rimossi dal carrello!");

    products.forEach(product => {
      this.cartService.removeProduct(product._id);
    });

    this.router.navigate(["/view-cart"]);
  }
}
