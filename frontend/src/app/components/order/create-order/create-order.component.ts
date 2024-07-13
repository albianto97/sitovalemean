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
  order: any; // Initialize with an empty object
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

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent(): Promise<void> {
    this.user = await this.authService.getUserFromToken();
    if (!this.user) {
      this.router.navigate(['login']);
      return;
    }

    this.productsInCart = this.cartService.getCart().products;
    this.createOrderObject();
    this.isOrderLoaded = true;
    await this.checkDispoProducts();
  }

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
    console.log(this.order);
  }

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

  handleInputTextArea(ev: any): void {
    this.note = ev.target.value;
    this.createOrderObject();
  }

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
      console.error('Errore:', error);
    }
  }

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

      this.orderService.createOrder(order).subscribe((result: any) => {
        console.log(result, order);
        if (result.result === 1) {
          this.handleUnavailableProducts(result.products);
        } else {
          this.cartService.emptyCart();
          this.router.navigate(['/profilo']);
        }
      });
    } else {
      // Deve effettuare il login per poter effettuare l'ordine
    }
  }

  handleUnavailableProducts(products: Product[]): void {
    let productString = products.map((p: Product) => p.name).join(", ");
    alert("Impossibile, prodotti non disponibili: " + productString + "\nVerranno rimossi dal carrello!");

    products.forEach(product => {
      this.cartService.removeProduct(product._id);
    });

    this.router.navigate(["/view-cart"]);
  }
}
