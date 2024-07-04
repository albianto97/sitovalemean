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
  productsBestSeller: any[] = [];
  constructor(private router: Router, private authService: AuthService, private productService: ProductService){
    this.isAdmin = authService.isAdmin();  
    this.productService.getTopProducts().subscribe((bestProducts:any) => {
      this.productsBestSeller = bestProducts;
      if(this.productsBestSeller.length > 6){
        this.productsBestSeller = this.productsBestSeller.slice(0,6)
      }
      console.log("ciao",this.productsBestSeller);
      
    })
  }
  ordina(){
    this.router.navigate(['/productList']);
    // va indirizzato nella lista degli articoli
  }

}
