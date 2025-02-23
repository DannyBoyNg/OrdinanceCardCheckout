import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalStateService } from '../../../services/global-state.service';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { User } from '../../../interfaces/user.interface';
import { DialogService } from '@dannyboyng/dialog';

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
  dialogService = inject(DialogService);

  barcode = signal('');
  form = this.fb.group({
    id: 0,
    barcode: '',
    name: '',
    admin: 0
  });

  ngOnInit() {
    const barcodeControl = this.form.controls.barcode;
    barcodeControl.setValidators(Validators.required);
    barcodeControl.disable();
    const nameControl = this.form.controls.name;
    nameControl.setValidators(Validators.required);

    if (this.data.mode === 'Edit') {
      const user = this.data.user as User;
      this.barcode.set(user.BarCode);
      this.form.setValue({
        id: user.Id,
        barcode: user.BarCode,
        name: user.Name,
        admin: user.Admin
      })
    }

    this.state.barcodeScanner$
    .pipe(takeUntil(this.autoUnsubscribe))
    .subscribe(async (barcode) => {
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

  async createUser() {
    this.form.enable();
    const user = this.form.value as User;
    try {
      await this.db.createUser(user);
    } catch(ex) {
      let errMsg = 'Cannot create user: An unknown error has occurred.';
      if (ex == "Error: Error invoking remote method 'createUser': SqliteError: UNIQUE constraint failed: Users.BarCode") {
        errMsg = 'Cannot create user: Temple Recommend already exist.';
      }
      this.dialogService.error(errMsg);
    }
    this.closeModal(true);
  }

  async updateUser() {

    this.form.enable();
    const user = this.form.value as User;
    await this.db.updateUser(user);
    this.closeModal(true);
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
