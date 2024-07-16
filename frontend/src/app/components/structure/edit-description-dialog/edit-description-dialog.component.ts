import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-description-dialog',
  templateUrl: './edit-description-dialog.component.html',
  styleUrls: ['./edit-description-dialog.component.css']
})
export class EditDescriptionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { description: string, type: string, message: string, secondaryMessage: string }
  ) {}

  // Metodo chiamato quando si clicca sul pulsante "Cancel"
  onCancel(): void {
    this.dialogRef.close();
  }

  // Metodo chiamato quando si clicca sul pulsante "Save"
  onSave(): void {
    this.dialogRef.close(this.data.description);
  }
}
