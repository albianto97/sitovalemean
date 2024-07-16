import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dialog-struttura',
  templateUrl: './dialog-struttura.component.html',
  styleUrls: ['./dialog-struttura.component.css']
})
export class DialogStrutturaComponent {
  // Proprietà di input per ricevere il titolo dal componente genitore
  @Input() titolo!: string;
}
