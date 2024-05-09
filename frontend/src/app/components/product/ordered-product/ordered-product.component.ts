import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ordered-product',
  templateUrl: './ordered-product.component.html',
  styleUrls: ['./ordered-product.component.css']
})
export class OrderedProductComponent {
 @Input() orderedProduct: any;
 @Input() isTableMode:boolean = false;
}
