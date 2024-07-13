import { Component } from '@angular/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../models/product";
import { CartService } from "../../services/cart.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  products: Product[] = [];
  constructor(private productService: ProductService, private cartService: CartService, 
    private router: Router) { }


  ngOnInit(): void {
    this.reloadCart();
  }


  emptyCart() {
    this.cartService.emptyCart();
    this.reloadCart();
  }
  // createOrderFirstStep(){
  //   this.router.navigate(['/order'], { state: { order: {} } });
  // }
  reloadCart() {
    //this.products = this.cartService.getCart().products;
    // Verifica se 'cart' è presente nello storage locale e se contiene un valore valido
    console.log(localStorage['cart']);

    if (localStorage['cart']) {
      try {
        let cartProducts: any = JSON.parse(localStorage['cart']);
        let productIds = cartProducts.products.map((item: any) => item.productId);
        this.productService.getProductsById(productIds).subscribe((data) => {
          // conversione dell'array dei prodotti nel carrello in un oggetto key => value per ogni articolo,
          // così da avere accesso diretto e non sprecare risorse per assegnare la quantita all'articolo trovato sul DB
          const indexedArray = cartProducts.products.reduce((accumulator: any, current: any) => {
            accumulator[current.productId] = current.quantity;
            return accumulator;
          }, {});

          this.products = data.map((product: Product) => {
            product.quantity = indexedArray[product._id!];
            return product;
          });
        });
        console.log(this.products);

      } catch (error) {
        console.error('Errore durante il parsing del valore JSON in localStorage:', error);
      }
    } else {
      console.error('Il valore di "cart" non è presente nello storage locale, carrello vuoto');
    }
  }
}
