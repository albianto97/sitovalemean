import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }
  initCart() {
    var cart = {
      products: [
        { productId: "6564af0c79c5b00a9e6c58cc", quantity: 3 },
        { productId: "6564afdc595c21d4cf11fc5e", quantity: 1 }
      ]
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
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
    localStorage.removeItem('cart');
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
}
