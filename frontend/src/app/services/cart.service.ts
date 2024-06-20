import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartModify: Observable<any>;
  cartModifySubscribers: any[] = [];

  constructor() { this.cartModify = new Observable<any>(subscriber => {
    console.log("CART: " + subscriber);
    this.cartModifySubscribers.push(subscriber);
  } ) }

  // Aggiungere un prodotto al carrello: ho ipotizzato di passare solamente id del prodotto e qta richiesta
  addToCart(productId: any, quantity: any) {
    // Recuperare il carrello dal Local Storage
    var cart = this.getCart();
    console.log(cart);

    // Verificare se il prodotto è già nel carrello
    var productExist = cart.products.find((p: { productId: any; }) => p.productId === productId);

    if (productExist) {
      // Se il prodotto esiste già, aggiornare la quantità
      productExist.quantity += quantity;
    } else {
      // Se il prodotto non esiste, aggiungerlo al carrello
      cart.products.push({ productId: productId, quantity: quantity });
    }

    // Salvare il carrello nel Local Storage
    localStorage.setItem('cart', JSON.stringify(cart));
    this.notifySubscribers();
  }

  // Rimuovere un prodotto dal carrello
  removeProduct(productId: any) {
    // Recuperare il carrello dal Local Storage
    var cart = this.getCart();

    // Rimuovere il prodotto dal carrello
    cart.products = cart.products.filter((p: { productId: any; }) => p.productId !== productId);

    // Salvare il carrello nel Local Storage
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Svuotare il carrello
  emptyCart() {
    // Salvare il carrello vuoto nel Local Storage
    localStorage.setItem('cart', JSON.stringify({products : []}));
  }

  // Recuperare il carrello dal Local Storage
  getCart() {
    var cart = localStorage.getItem('cart');
    if(!cart){
      cart = JSON.stringify({ products: [] });
    }
    return cart ? JSON.parse(cart) : { products: [] };
  }

  getQuantityByProductId(productId: any){
    let cart = this.getCart();
    let product = cart.products.filter((p: any) => p.productId == productId);
    if(product.length > 0){
      return product[0].quantity;
    }
    return 0;
  }

  notifySubscribers(){
    for(let i = 0; i< this.cartModifySubscribers.length; i++){
      let s = this.cartModifySubscribers[i];
      s.next();
    }
  }
}
