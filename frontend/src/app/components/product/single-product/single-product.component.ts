import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) { }

  async ngOnInit(): Promise<void> {
    // Recupera l'ID del prodotto dalla route
    const productId = this.route.snapshot.paramMap.get('productId');
    console.log(productId);

    // Chiamata al servizio per ottenere il singolo prodotto
    if (productId) {
        this.product = await new Promise((resolve) => {
          this.productService.getSingleProduct(productId).subscribe(
            (data) => resolve(data),
          );
        }) as Product;
    }
  }

}
