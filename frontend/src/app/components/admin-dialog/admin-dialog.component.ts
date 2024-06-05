import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-admin-dialog',
  templateUrl: './admin-dialog.component.html',
  styleUrls: ['./admin-dialog.component.css']
})
export class AdminDialogComponent {
  username: string = '';

  constructor(public dialogRef: MatDialogRef<AdminDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  makeAdmin(): void {
    // Invia il nome utente al backend per fare l'utente un amministratore
    this.dialogRef.close(this.username);
  }

}
