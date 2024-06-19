import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import {OrderService} from "../../../services/order.service";
import {SocketService} from "../../../services/socket.service";
import {NotifyService} from "../../../services/notify.service";
import {Notify} from "../../../models/notify";
import {UserService} from "../../../services/user.service";


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {
  order: any;
  orderStates: string[] = [];
  selectedOrderState: string = 'inAttesa';
  isAdmin:boolean = false;
  constructor(private route: ActivatedRoute, private productService: ProductService,
              public authService:AuthService,
              private orderService: OrderService,
              private socketService: SocketService,
              private notificationService: NotifyService,
              private userService: UserService) { }
  ngOnInit(): void {
    let orderId = '';
    const state = history.state;
    if (state && state.orderId) {
      orderId = state.orderId;
    }
    let order = this.orderService.getOrder(orderId).subscribe((order: any) => {
      this.order = order;
      this.selectedOrderState = order.status; // Imposta lo stato selezionato in base all'ordine
    });
    this.orderStates = Object.keys(Status);

  }

  sendNotification() {
    console.log(this.order);
    // Recupera l'utente dall'ID
    const notifyDate = new Date(); // Ottieni la data corrente

    this.userService.getSingleUserById(this.order.user).subscribe(
      (userData: any) => {
        if (userData) {
          const username = userData.username;
          // Invia la notifica utilizzando il nome utente recuperato
          const message = "Il prodotto è nel seguente stato: " + this.selectedOrderState;
          this.socketService.sendNotification({ username: username, message: message });
          // Chiamata al metodo saveEvaso del servizio NotifyService
          this.notificationService.saveEvaso(username, notifyDate.toISOString(), this.order._id, false, message).subscribe(
            (notification: Notify) => {
              console.log("Notifica salvata con successo:", notification);
              // Gestisci la notifica salvata come preferisci
              this.notificationService.notifySubscribers();
            }
          );
        }
      }
    );
  }



  onStateChange(event: any) {
    this.selectedOrderState = event.value; // Aggiorna lo stato selezionato quando cambia
  }
}
