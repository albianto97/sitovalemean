import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isAdmin: boolean = false;
  constructor(private router: Router, private authService: AuthService, private productService: ProductService){
    this.isAdmin = authService.isAdmin();  
  }
  ordina(){
    this.router.navigate(['/productList']);
    // va indirizzato nella lista degli articoli
  }

}
