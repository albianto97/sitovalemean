import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = [
    { name: 'Regalo 1', description: 'Descrizione del regalo 1', quantity: 3 },
    { name: 'Regalo 2', description: 'Descrizione del regalo 2', quantity: 0 }
  ];
}
