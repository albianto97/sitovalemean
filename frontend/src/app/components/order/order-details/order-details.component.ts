import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { SocketService } from 'src/app/services/socket.service';
import { NotifyService } from 'src/app/services/notify.service';
import { UserService } from 'src/app/services/user.service';
import { Notify } from 'src/app/models/notify';
import { User } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  @Input() order: any;
  user: any;
  orderStates: string[] = [];
  orderedProducts: any[] = [];
  isTableMode: boolean = false;
  isAdmin: boolean = false;
  total: any = {
    totQuantity: 0,
    totPrice: 0
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    public authService: AuthService,
    private socketService: SocketService,
    private notificationService: NotifyService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    if (this.order) {
      this.initializeOrderDetails();
    } else {
      const state = history.state;
      if (state && state.order) {
        const orderId = state.order._id;
        this.orderService.getOrder(orderId).subscribe(orderFromDb => {
          this.order = orderFromDb;
          this.initializeOrderDetails();
        });
      }
    }
    this.orderStates = Object.keys(Status);
  }

  // Metodo per inizializzare i dettagli dell'ordine
  initializeOrderDetails(): void {
    const productIds = this.order.products.map((product: any) => product.productId);
    this.productService.getProductsById(productIds).subscribe(
      (products: Product[]) => {
        for (let i = 0; i < products.length; i++) {
          const orderedProduct = { ...this.order.products[i], ...products[i] };
          this.orderedProducts.push(orderedProduct);
          this.total.totQuantity += orderedProduct.quantity;
          this.total.totPrice += orderedProduct.quantity * orderedProduct.price;
        }
      },
      (error: any) => {
        console.error('Errore durante il recupero dei prodotti:', error);
      }
    );
    this.userService.getSingleUserById(this.order.user).subscribe(
      (userData: any) => {
        this.user = userData;
      },
      (error: any) => {
        console.error('Errore durante il recupero dei dati dell\'utente:', error);
      }
    );
  }

  // Metodo per aggiornare l'ordine
  updateOrder(): void {
    if (this.order.status === "terminato") this.order.closingDate = new Date();
    if (this.order.status === "consegnato") {
      if (!this.order.closingDate) this.order.closingDate = new Date();
      this.order.shippingDate = new Date();
    }

    this.orderService.updateOrder(this.order).subscribe(
      result => {
        history.state.order = result;
        const message = 'Modifica dell\'ordine avvenuta con successo';
        this._snackBar.open(message, 'Chiudi', { duration: 5000 });
        this.sendNotification();
      },
      error => {
        const message = 'Errore durante la modifica dell\'ordine';
        this._snackBar.open(message, 'Chiudi', { duration: 5000 });
        console.error(message, error);
      }
    );
  }

  // Metodo per contattare il cliente
  contattaCliente(): void {
    this.router.navigate(['/contatta-cliente'], { state: { username: this.user.username, orderId: this.order._id } });
  }

  selectedOrderState: any;

  // Metodo per gestire il cambio di stato dell'ordine
  onStateChange(event: any): void {
    this.selectedOrderState = event.value;
  }

  // Metodo per inviare una notifica
  sendNotification(): void {
    const notifyDate = new Date();
    this.userService.getSingleUserById(this.order.user).subscribe(
      (userData: any) => {
        if (userData) {
          const username = userData.username;
          const message = "L'ordine " + this.order._id + " è nel seguente stato: " + this.order.status;
          this.socketService.sendNotification({ username, message });
          this.notificationService.createNotify(username, notifyDate.toISOString(), this.order._id, false, message, "").subscribe(
            (notification: Notify) => {
              this.notificationService.notifySubscribers();
            },
            (error: any) => {
              console.error('Errore durante la creazione della notifica:', error);
            }
          );
        }
      },
      (error: any) => {
        console.error('Errore durante il recupero dei dati dell\'utente:', error);
      }
    );
  }
}
