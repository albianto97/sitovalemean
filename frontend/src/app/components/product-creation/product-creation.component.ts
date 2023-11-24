import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent {
  newProduct: Product = new Product({ name: '', description: '', price: 0 });

  constructor(private productService: ProductService) {}

  createProduct() {
    // Chiamare il servizio per creare il prodotto
    this.productService.createProduct(this.newProduct).subscribe(
      (result) => {
        console.log('Prodotto creato con successo', result);
        // Puoi aggiungere ulteriori azioni dopo la creazione del prodotto
      },
      (error) => {
        console.error('Errore durante la creazione del prodotto', error);
        // Puoi gestire l'errore in modo appropriato, ad esempio mostrando un messaggio all'utente
      }
    );
  }
}

