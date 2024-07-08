import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-description-dialog',
  templateUrl: './edit-description-dialog.component.html',
  styleUrls: ['./edit-description-dialog.component.css']
})
export class EditDescriptionDialogComponent {
  confirmUpdate: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { description: string, type: string, message: string, secondaryMessage: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.confirmUpdate) {
      this.confirmUpdate = true;
    } else {
      this.dialogRef.close(this.data.description);
    }
  }
}
