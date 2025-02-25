import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@dannyboyng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DatabaseService } from '../../../services/database.service';
import { GlobalStateService } from '../../../services/global-state.service';
import { OrdinanceCard } from '../../../interfaces/ordinace-card.interface';

@Component({
  selector: 'app-create-edit-card-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './create-edit-card-dialog.component.html',
  styleUrl: './create-edit-card-dialog.component.css'
})
export class CreateEditCardDialogComponent {
  autoUnsubscribe = new Subject<void>();

  dialogRef = inject(MatDialogRef<CreateEditCardDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  state = inject(GlobalStateService);
  fb = inject(FormBuilder);
  db = inject(DatabaseService);
  dialogService = inject(DialogService);

  barcode = signal('');
  form = this.fb.group({
    Id: 0,
    BarCode: '',
    Language: '',
    CheckedOut: 0,
    CheckedOutBy: '',
    CheckedOutAt: '',
  });

  async ngOnInit() {
    //Form setup
    const barcodeControl = this.form.controls.BarCode;
    barcodeControl.setValidators(Validators.required);
    barcodeControl.disable();
    const nameControl = this.form.controls.Language;
    nameControl.setValidators(Validators.required);

    //Edit mode
    if (this.data.mode === 'Edit') {
      const card = this.data.card as OrdinanceCard;
      this.barcode.set(card.BarCode);
      this.form.setValue({
        Id: card.Id,
        BarCode: card.BarCode,
        Language: card.Language,
        CheckedOut: card.CheckedOut,
        CheckedOutBy: card.CheckedOutBy ?? null,
        CheckedOutAt: card.CheckedOutAt ?? null,
      })
    }

    //Listen for barcode scanner
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

  async createCard() {
    this.form.enable();
    const card = this.form.value as OrdinanceCard;
    try {
      await this.db.createCard(card);
    } catch(ex) {
      let errMsg = 'Cannot create card: An unknown error has occurred.';
      this.dialogService.error(errMsg);
    }
    this.closeModal(true);
  }

  async updateCard() {
    this.form.enable();
    const card = this.form.value as OrdinanceCard;
    await this.db.updateCard(card);
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
