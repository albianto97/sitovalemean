import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dialog-struttura',
  templateUrl: './dialog-struttura.component.html',
    styleUrls: ['./dialog-struttura.component.css']
})
export class DialogStrutturaComponent {
  @Input() titolo!: string;
}
