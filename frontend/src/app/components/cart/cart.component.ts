// Importazioni necessarie per il componente
import { Component } from '@angular/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../models/product";
import { CartService } from "../../services/cart.service";
import { Router } from '@angular/router';

// Definizione del componente con selettore, template e stile associati
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  // Array di prodotti nel carrello
  products: Product[] = [];

  // Costruttore con i servizi necessari
  constructor(private productService: ProductService, private cartService: CartService, 
    private router: Router) { }

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.reloadCart();
  }

  // Metodo per svuotare il carrello e ricaricarlo
  emptyCart() {
    this.cartService.emptyCart();
    this.reloadCart();
  }

  // Metodo per ricaricare i prodotti nel carrello
  reloadCart() {
    // Controllo se 'cart' è presente nello storage locale e se contiene un valore valido
    console.log(localStorage['cart']);

    if (localStorage['cart']) {
      try {
        let cartProducts: any = JSON.parse(localStorage['cart']);
        let productIds = cartProducts.products.map((item: any) => item.productId);
        this.productService.getProductsById(productIds).subscribe(
          (data) => {
            // Conversione dell'array dei prodotti nel carrello in un oggetto chiave-valore per ogni articolo,
            // così da avere accesso diretto e non sprecare risorse per assegnare la quantità all'articolo trovato sul DB
            const indexedArray = cartProducts.products.reduce((accumulator: any, current: any) => {
              accumulator[current.productId] = current.quantity;
              return accumulator;
            }, {});

            this.products = data.map((product: Product) => {
              product.quantity = indexedArray[product._id!];
              return product;
            });
          },
          (error) => {
            console.error('Errore durante il recupero dei prodotti:', error);
          }
        );
        console.log(this.products);

      } catch (error) {
        console.error('Errore durante il parsing del valore JSON in localStorage:', error);
      }
    } else {
      console.error('Il valore di "cart" non è presente nello storage locale, carrello vuoto');
    }
  }
}
