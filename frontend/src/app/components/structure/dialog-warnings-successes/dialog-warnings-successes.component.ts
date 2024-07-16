import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-warnings-successes',
  templateUrl: './dialog-warnings-successes.component.html',
  styleUrls: ['./dialog-warnings-successes.component.css']
})
export class DialogWarningsSuccessesComponent implements OnInit {
  warningArray: any[] = [];
  successArray: any[] = [];
  errorArray: any[] = [];
  isLoadingOn: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogWarningsSuccessesComponent>
  ) {}

  // Metodo eseguito all'inizializzazione del componente
  ngOnInit(): void {
    if (this.data.warningArray) {
      this.warningArray = this.data.warningArray;
    }
    if (this.data.successArray) {
      this.successArray = this.data.successArray;
    }
    if (this.data.errorArray) {
      this.errorArray = this.data.errorArray;
    }
  }
}
