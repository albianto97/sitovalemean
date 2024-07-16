import { Component, Input } from '@angular/core';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent {
  // Input property per ricevere l'array di ordini dal componente genitore
  @Input() orders!: Order[];
}
