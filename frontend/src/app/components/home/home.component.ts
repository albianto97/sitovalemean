import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAdmin: boolean = false;
  productsBestSeller: any[] = [];

  constructor(private router: Router, private authService: AuthService, private productService: ProductService) { }

  ngOnInit(): void {
    // Verifica se l'utente è amministratore
    this.isAdmin = this.authService.isAdmin();

    // Recupera i prodotti più venduti
    this.productService.getTopProducts().subscribe(
      (bestProducts: any) => {
        this.productsBestSeller = bestProducts;
        if (this.productsBestSeller.length > 6) {
          this.productsBestSeller = this.productsBestSeller.slice(0, 6);
        }
      },
      (error: any) => {
        console.error('Errore durante il recupero dei prodotti più venduti:', error);
      }
    );
  }

  // Metodo per navigare alla lista dei prodotti
  ordina() {
    this.router.navigate(['/productList']);
  }
}
