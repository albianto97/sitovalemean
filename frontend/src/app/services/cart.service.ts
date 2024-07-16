import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartModify: Observable<any>;
  cartModifySubscribers: any[] = [];

  constructor() {
    // Inizializza l'osservabile cartModify che notifica i sottoscrittori sulle modifiche del carrello
    this.cartModify = new Observable<any>(subscriber => {
      console.log("CART: " + subscriber);
      this.cartModifySubscribers.push(subscriber);
    });
  }

  // Metodo per aggiungere un prodotto al carrello
  addToCart(productId: any, quantity: any) {
    // Recupera il carrello dal Local Storage
    var cart = this.getCart();
    console.log(cart);

    // Verifica se il prodotto è già nel carrello
    var productExist = cart.products.find((p: { productId: any; }) => p.productId === productId);

    if (productExist) {
      // Se il prodotto esiste già, aggiorna la quantità
      productExist.quantity += quantity;
    } else {
      // Se il prodotto non esiste, aggiungilo al carrello
      cart.products.push({ productId: productId, quantity: quantity });
    }

    // Salva il carrello nel Local Storage
    localStorage.setItem('cart', JSON.stringify(cart));
    this.notifySubscribers(); // Notifica i sottoscrittori delle modifiche
  }

  // Metodo per rimuovere un prodotto dal carrello
  removeProduct(productId: any) {
    // Recupera il carrello dal Local Storage
    var cart = this.getCart();

    // Rimuove il prodotto dal carrello
    cart.products = cart.products.filter((p: { productId: any; }) => p.productId !== productId);

    // Salva il carrello nel Local Storage
    localStorage.setItem('cart', JSON.stringify(cart));
    this.notifySubscribers(); // Notifica i sottoscrittori delle modifiche
  }

  // Metodo per svuotare il carrello
  emptyCart() {
    // Salva il carrello vuoto nel Local Storage
    localStorage.setItem('cart', JSON.stringify({ products: [] }));
    this.notifySubscribers(); // Notifica i sottoscrittori delle modifiche
  }

  // Metodo per recuperare il carrello dal Local Storage
  getCart() {
    var cart = localStorage.getItem('cart');
    if (!cart) {
      cart = JSON.stringify({ products: [] });
    }
    return cart ? JSON.parse(cart) : { products: [] };
  }

  // Metodo per ottenere la quantità di un prodotto specifico nel carrello
  getQuantityByProductId(productId: any) {
    let cart = this.getCart();
    let product = cart.products.filter((p: any) => p.productId == productId);
    if (product.length > 0) {
      return product[0].quantity;
    }
    return 0;
  }

  // Metodo per notificare i sottoscrittori delle modifiche del carrello
  notifySubscribers() {
    for (let i = 0; i < this.cartModifySubscribers.length; i++) {
      let s = this.cartModifySubscribers[i];
      s.next();
    }
  }
}
