import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(private auth: AuthService, private router: Router){
    //cartService.initCart();
    this.logOut()
  }

  logOut(){
    this.auth.logout();
    location.reload();
    //this.router.navigate(['/login']); //forse dopo admin è da togliere perche fa reload da solo
  }
}
