import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalStateService } from '../../../services/global-state.service';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-create-edit-user-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './create-edit-user-dialog.component.html',
  styleUrl: './create-edit-user-dialog.component.css'
})
export class CreateEditUserDialogComponent {

  autoUnsubscribe = new Subject<void>();

  dialogRef = inject(MatDialogRef<CreateEditUserDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  state = inject(GlobalStateService);
  fb = inject(FormBuilder);
  db = inject(DatabaseService);

  barcode = signal('');
  form = this.fb.group({
    barcode: '',
    name: '',
  });

  ngOnInit() {
    const barcodeControl = this.form.controls.barcode;
    barcodeControl.setValidators(Validators.required);
    barcodeControl.disable();
    const nameControl = this.form.controls.name;
    nameControl.setValidators(Validators.required);

    if (this.data.mode === 'Edit') {
      
    }

    this.state.barcodeScanner$
    .pipe(takeUntil(this.autoUnsubscribe))
    .subscribe(async (barcode) => {
      console.log('Barcode scanned: ', barcode);
      this.barcode.set(barcode);
      barcodeControl.setValue(barcode);
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
    this.form.enable();
    const user = this.form.value as User;
    this.db.createUser(user);
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
