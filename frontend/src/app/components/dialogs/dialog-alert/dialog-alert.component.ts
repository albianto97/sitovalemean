import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// Definizione del componente con selettore, template e stile associati
@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.css']
})
export class DialogAlertComponent {
  // Costruttore che inietta i dati del dialog utilizzando MAT_DIALOG_DATA
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
