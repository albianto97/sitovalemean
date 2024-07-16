import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ordered-product',
  templateUrl: './ordered-product.component.html',
  styleUrls: ['./ordered-product.component.css']
})
export class OrderedProductComponent {
  // Input property per ricevere i dettagli del prodotto ordinato dal componente genitore
  @Input() orderedProduct: any;
  
  // Input property per determinare se il componente deve essere visualizzato in modalità tabella
  @Input() isTableMode: boolean = false;
}
