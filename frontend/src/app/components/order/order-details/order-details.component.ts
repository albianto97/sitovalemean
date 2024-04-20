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
    let order = this.orderService.getOrder(orderId).subscribe((order: any) => this.order = order);
    this.orderStates = Object.keys(Status);

  }

  sendNotification() {
    console.log(this.order);
    // Recupera l'utente dall'ID
    const user = this.authService.getUserFromToken(); //admin
    this.userService.getSingleUserById(this.order.user).subscribe(
      (userData: any) => {
        if (userData) {
          const username = userData.username;
          // Invia la notifica utilizzando il nome utente recuperato
          this.socketService.sendNotification({ username: username, message: "test" });

          // Chiamata al metodo saveEvaso del servizio NotifyService
          this.notificationService.saveEvaso(username, this.order._id, "il prodotto è nel seguente stato" /* + this. inserire lo stato di salvataggio*/).subscribe(
            (notification: Notify) => {
              console.log("Notifica salvata con successo:", notification);
              // Gestisci la notifica salvata come preferisci
            }
          );
        }
      }
    );
  }

}
