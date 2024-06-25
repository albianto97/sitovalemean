import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-conferma',
  templateUrl: './dialog-conferma.component.html',
  styleUrls: ['./dialog-conferma.component.css']
})
export class DialogConfermaComponent {
  isConfirmButtonDisabled: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<DialogConfermaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, type:string, secondaryMessage: string | undefined, imgLink: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
