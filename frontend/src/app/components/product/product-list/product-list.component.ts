// Importazioni necessarie
import { Component, Input } from '@angular/core';
import { Product } from "../../../models/product";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  // Input property per ricevere l'array di prodotti dal componente genitore
  @Input() products: Product[] = [];
}
