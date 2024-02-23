import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user: User | undefined;
  saluto: string = "";
  cart:any;
  constructor(private auth: AuthService, private router: Router, private cartService: CartService){
      //cartService.initCart();
  }
  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.user = this.auth.getUserFromToken();
    this.calcolaSaluto();
  }
  calcolaSaluto() {
    const oraCorrente = new Date().getHours();

    if (oraCorrente >= 5 && oraCorrente < 12) {
      this.saluto = 'Buongiorno, ' + this.user?.username + '!';
    } else if (oraCorrente >= 12 && oraCorrente < 18) {
      this.saluto = 'Buon pomeriggio, ' + this.user?.username + '!';
    } else {
      this.saluto = 'Buonasera, ' + this.user?.username + '!';
    }
  }

  viewCart(){
    this.router.navigate(['/view-cart']);
  }
  logOut(){
    this.auth.logout();
    location.reload();
    this.router.navigate(['/login']); //forse dopo admin è da togliere perche fa reload da solo
  }
}
