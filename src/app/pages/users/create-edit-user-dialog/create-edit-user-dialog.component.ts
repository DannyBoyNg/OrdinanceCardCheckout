import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-edit-user-dialog',
  imports: [CdkDrag],
  templateUrl: './create-edit-user-dialog.component.html',
  styleUrl: './create-edit-user-dialog.component.css'
})
export class CreateEditUserDialogComponent {

  dialogRef = inject(MatDialogRef<CreateEditUserDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  
  closeModal(updateCaller = false) {
    this.dialogRef.close({updateCaller});
  }
}
