import { Component, Input, OnInit } from '@angular/core';
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
  constructor(private auth: AuthService, private router: Router, private cartService: CartService, private notifyService: NotifyService) {
    //cartService.initCart();
  }
  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.user = this.auth.getUserFromToken();
    this.isAdmin = this.auth.isAdmin();
    this.calcolaSaluto();
    this.notifyService.modify.subscribe(d => {
      this.countUnreadNotifications();
    })
    this.cartService.cartModify.subscribe(d => {
      this.cart = this.cartService.getCart();
    })
  }
  calcolaSaluto() {
    const oraCorrente = new Date().getHours();
    if (this.user != undefined) {
      if (oraCorrente >= 5 && oraCorrente < 12) {
        this.saluto = 'Buongiorno, ' + this.user?.username + '!';
      } else if (oraCorrente >= 12 && oraCorrente < 18) {
        this.saluto = 'Buon pomeriggio, ' + this.user?.username + '!';
      } else {
        this.saluto = 'Buonasera, ' + this.user?.username + '!';
      }
    }else{
      this.saluto = 'Ciao, ricordati di accedere';
    }
  }
  countUnreadNotifications() {
    if (this.user) {
      this.notifyService.getUserNotifications(this.user.username).subscribe(
        (notifications: any[]) => {
          // Filtra le notifiche non lette
          this.unreadNotificationsCount = (notifications.filter(notification => !notification.read).length).toString();
        }
      );
    }
  }
  viewCart() {
    this.router.navigate(['/view-cart']);
  }


}
