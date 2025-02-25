import { Component, inject, signal } from '@angular/core';
import { GlobalStateService } from '../../services/global-state.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { OrdinanceCard } from '../../interfaces/ordinace-card.interface';
import { DatabaseService } from '../../services/database.service';
import { DialogService } from '@dannyboyng/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditUserDialogComponent } from '../users/create-edit-user-dialog/create-edit-user-dialog.component';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  autoUnsubscribe = new Subject<void>();

  //dependencies
  state = inject(GlobalStateService);
  db = inject(DatabaseService);
  dialogService = inject(DialogService);
  dialog = inject(MatDialog);
  
  //local state
  scannedUser = signal<User|null>(null);
  scannedCard = signal<OrdinanceCard|null>(null);

  ngOnInit() {
    //listen for barcode scanner
    this.state.barcodeScanner$
    .pipe(takeUntil(this.autoUnsubscribe))
    .subscribe(async (barcode) => {
      await this.processBarcodeScan(barcode);
      //check if card is already checked out. If so, check it in
      if (this.scannedUser() == null && this.scannedCard()?.CheckedOut === 1) {
        await this.checkIn();
      }
      //perform checkout if user and card are scanned
      if (this.scannedUser() && this.scannedCard()) {
        await this.checkOut();
      }
    });
  }

  async checkOut() {
    const card = this.scannedCard();
    if (!card) return;
    await this.db.updateCard({Id: card.Id, BarCode: card.BarCode, Language: card.Language, CheckedOut: 1, CheckedOutBy: this.scannedUser()?.Name, CheckedOutAt: new Date().toISOString()});
    this.state.updateCardCount();
    await firstValueFrom(this.dialogService.info(['Checkout complete']));
    setTimeout(() => {
      this.resetScannedUser();
      this.resetScannedCard();
    }, 750);
  }

  async checkIn() {
    const card = this.scannedCard();
    if (!card) return;
    await this.db.updateCard({Id: card.Id, BarCode: card.BarCode, Language: card.Language, CheckedOut: 0, CheckedOutBy: undefined, CheckedOutAt: undefined});
    this.state.updateCardCount();
    await firstValueFrom(this.dialogService.info(['Card returned']));
    setTimeout(() => {
      this.resetScannedUser();
      this.resetScannedCard();
    }, 750);
  }

  async processBarcodeScan(barcode: string) {
    const card = await this.db.getCard(barcode);
    const user = await this.db.getUser(barcode);
    if (card) {
      this.scannedCard.set(card);
    } else if (user) {
      this.scannedUser.set(user);
    } else {
      const choices = [
        {'key': 'CreateUser', 'value': 'Create user'},
        //{'key': 'CreateCard', 'value': 'Create card'}
      ];
      const response = await firstValueFrom(this.dialogService.choice(['Barcode not recognized. If this is a new user, please create a new user'], choices));
      if (response === 'CreateUser') {
        this.dialog.open(CreateEditUserDialogComponent, 
          {
            position: {top: '100px'},
            maxWidth: '100%',
            data: {
              mode: 'Create',
              barcode: barcode,
            },
          }
        ).afterClosed().subscribe(async (result) => {
          if (result?.updateCaller) {
            this.scannedUser.set(result.createdUser);
          }
        });
      }
    }
  }

  ngOnDestroy() {
    this.autoUnsubscribe.next();
    this.autoUnsubscribe.complete();
  }

  resetScannedUser() {
    this.scannedUser.set(null);
  }

  resetScannedCard() {
    this.scannedCard.set(null);
  }
}
