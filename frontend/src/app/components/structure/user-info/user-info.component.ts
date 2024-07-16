import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user: User | undefined;
  saluto: string = "";
  cart: any;
  isAdmin: boolean = false;
  unreadNotificationsCount = '0';

  constructor(
    private auth: AuthService,
    private router: Router,
    private cartService: CartService,
    private notifyService: NotifyService
  ) {}

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.user = this.auth.getUserFromToken();
    this.isAdmin = this.auth.isAdmin();
    this.calcolaSaluto();
    this.countUnreadNotifications();

    // Sottoscrizione agli eventi di modifica delle notifiche
    this.notifyService.modify.subscribe(d => {
      this.countUnreadNotifications();
    });

    // Sottoscrizione agli eventi di modifica del carrello
    this.cartService.cartModify.subscribe(d => {
      this.cart = this.cartService.getCart();
    });
  }

  // Metodo per calcolare il saluto basato sull'ora corrente
  calcolaSaluto() {
    const oraCorrente = new Date().getHours();
    if (this.user) {
      if (oraCorrente >= 5 && oraCorrente < 12) {
        this.saluto = 'Buongiorno, ' + this.user.username + '!';
      } else if (oraCorrente >= 12 && oraCorrente < 18) {
        this.saluto = 'Buon pomeriggio, ' + this.user.username + '!';
      } else {
        this.saluto = 'Buonasera, ' + this.user.username + '!';
      }
    } else {
      this.saluto = 'Ciao, ricordati di accedere';
    }
  }

  // Metodo per contare le notifiche non lette
  countUnreadNotifications() {
    if (this.user) {
      this.notifyService.getUserNotifications(this.user.username).subscribe(
        (notifications: any[]) => {
          this.unreadNotificationsCount = (notifications.filter(notification => !notification.read).length).toString();
        },
        (error) => {
          console.error('Errore nel recupero delle notifiche:', error);
        }
      );
    }
  }

  // Metodo per visualizzare il carrello
  viewCart() {
    this.router.navigate(['/view-cart']);
  }
}
