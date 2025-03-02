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
  isAdmin = signal(0);
  form = this.fb.group({
    Id: 0,
    BarCode: '',
    Name: '',
    Admin: 0
  });

  async ngOnInit() {
    const barcodeControl = this.form.controls.BarCode;
    barcodeControl.setValidators(Validators.required);
    barcodeControl.disable();
    const nameControl = this.form.controls.Name;
    nameControl.setValidators(Validators.required);

    if (this.data.mode === 'Create' && this.data.barcode) {
      this.barcode.set(this.data.barcode);
      barcodeControl.setValue(this.data.barcode);
    } else if (this.data.mode === 'Edit') {
      const user = this.data.user as User;
      this.barcode.set(user.BarCode);
      this.form.setValue({
        Id: user.Id,
        BarCode: user.BarCode,
        Name: user.Name,
        Admin: user.Admin
      })
    }
    if (this.data.isAdmin === true) {
      this.isAdmin.set(1);
    }
    const users = await this.db.getUsers();
    if (users.length === 0) {
      this.form.controls.Admin.setValue(1);
      this.form.controls.Admin.disable();
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
  
  closeModal(updateCaller = false, createdUser: User|null = null) {
    this.dialogRef.close({updateCaller, createdUser});
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
    this.closeModal(true, user);
  }

  async updateUser() {
    this.form.enable();
    const user = this.form.value as User;

    //Check if user is trying to remove the last admin
    const users = await this.db.getUsers();
    const admins = users.filter(x => x.Admin == 1);
    if (admins.length === 1 && user.Admin == 0 && admins[0].Id == user.Id) {
      this.dialogService.error(['You cannot remove the last admin.']);
      return;
    }

    await this.db.updateUser(user);
    this.closeModal(true);
  }
}
