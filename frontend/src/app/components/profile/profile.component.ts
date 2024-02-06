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

  user: User | undefined;
  bestProducts: Product[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filteredBestProducts: Product[] = [];
  selectedType: string | null = null;
  constructor(private auth: AuthService, private productService: ProductService) {

    this.productService.getProducts().subscribe((data) => {
      this.bestProducts = data.splice(0,3);
    });


  }
  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();

  }

}
