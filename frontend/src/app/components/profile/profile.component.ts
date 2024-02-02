import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { AuthService } from "../../services/auth.service";
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfiloComponent implements OnInit {

  constructor(private auth: AuthService,private productService: ProductService) { }
  user: User | undefined;
  bestProducts: Product[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filteredBestProducts: Product[] = [];
  selectedType: string | null = null;
  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();

    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products);

      this.filteredProducts = this.products.slice(0, 3);
    });

    this.productService.getBestProducts().subscribe((data) => {
        this.bestProducts = data;
      },
        (error) => {
          console.error('Errore nel recupero dei migliori prodotti:', error);
        });
      /*this.bestProducts = data;
      console.log(this.bestProducts);
      this.filteredBestProducts = this.bestProducts.slice(0, 3);*/
  }

}
