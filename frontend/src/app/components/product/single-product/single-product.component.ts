import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  // Metodo eseguito all'inizializzazione del componente
  async ngOnInit(): Promise<void> {
    // Recupera l'ID del prodotto dalla route
    const productId = this.route.snapshot.paramMap.get('productId');

    // Chiamata al servizio per ottenere il singolo prodotto
    if (productId) {
      try {
        this.product = await new Promise<Product>((resolve, reject) => {
          this.productService.getSingleProduct(productId).subscribe(
            (data) => resolve(data),
            (error) => {
              console.error('Errore durante il recupero del prodotto:', error);
              reject(error);
            }
          );
        });
      } catch (error) {
        console.error('Errore durante l\'inizializzazione del componente:', error);
      }
    }
  }
}
