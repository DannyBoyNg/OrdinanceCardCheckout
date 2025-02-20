import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { GlobalStateService } from '../../../services/global-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-edit-user-dialog',
  imports: [CdkDrag],
  templateUrl: './create-edit-user-dialog.component.html',
  styleUrl: './create-edit-user-dialog.component.css'
})
export class CreateEditUserDialogComponent {

  autoUnsubscribe = new Subject<void>();

  dialogRef = inject(MatDialogRef<CreateEditUserDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  state = inject(GlobalStateService);

  barcode = signal('');

  ngOnInit() {
    this.state.barcodeScanner$
    .pipe(takeUntil(this.autoUnsubscribe))
    .subscribe(async (barcode) => {
      console.log('Barcode scanned: ', barcode);
      this.barcode.set(barcode);
    });
  }

  ngOnDestroy() {
    this.autoUnsubscribe.next();
    this.autoUnsubscribe.complete();
  }
  
  closeModal(updateCaller = false) {
    this.dialogRef.close({updateCaller});
  }

  createUser() {

  }

  inject() {
    this.state.onKeyEvent('0');
    this.state.onKeyEvent('0');
    this.state.onKeyEvent('0');
    this.state.onKeyEvent('1');
    this.state.onKeyEvent('1');
    this.state.onKeyEvent('9');
    this.state.onKeyEvent('3');
    this.state.onKeyEvent('7');
    this.state.onKeyEvent('3');
    this.state.onKeyEvent('9');
  }

  inject2() {
    this.state.onKeyEvent('0');
    this.state.onKeyEvent('0');
    this.state.onKeyEvent('0');
    this.state.onKeyEvent('1');
    this.state.onKeyEvent('1');
    this.state.onKeyEvent('9');
    this.state.onKeyEvent('3');
    this.state.onKeyEvent('7');
    this.state.onKeyEvent('3');
    this.state.onKeyEvent('8');
  }
}
