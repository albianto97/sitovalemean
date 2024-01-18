import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() products!: Product[];
  @Input() selectedType!: string | null;
  @Input() isViewCarrello:boolean  = false;
  constructor(private cartService: CartService) { }
  ngOnInit(): void {

  }

  addItemToCart(itemId: string) {
    // aggiunge l'articolo al carrello
    this.cartService.addToCart(itemId, 1);
  }
}
