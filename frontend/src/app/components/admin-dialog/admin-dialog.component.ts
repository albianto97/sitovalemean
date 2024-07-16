// Importazioni necessarie per il componente
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// Definizione del componente con selettore, template e stile associati
@Component({
  selector: 'app-admin-dialog',
  templateUrl: './admin-dialog.component.html',
  styleUrls: ['./admin-dialog.component.css']
})
export class AdminDialogComponent {
  // Variabile per il nome utente
  username: string = '';

  // Costruttore con riferimento al dialogo
  constructor(public dialogRef: MatDialogRef<AdminDialogComponent>) { }

  // Metodo per chiudere il dialogo senza azioni
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Metodo per rendere un utente amministratore e chiudere il dialogo
  makeAdmin(): void {
    this.dialogRef.close(this.username);
  }
}
