import { Component, inject, signal } from '@angular/core';
import { GlobalStateService } from '../../services/global-state.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { OrdinanceCard } from '../../interfaces/ordinace-card.interface';
import { DatabaseService } from '../../services/database.service';
import { Dialog, DialogService, DialogType } from '@dannyboyng/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditUserDialogComponent } from '../users/create-edit-user-dialog/create-edit-user-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
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
  borrower = '';
  scannedUser = signal<User|null>(null);
  scannedCards = signal<OrdinanceCard[]>([]);

  ngOnInit() {
    //listen for barcode scanner
    this.state.barcodeScanner$
    .pipe(takeUntil(this.autoUnsubscribe))
    .subscribe(async (barcode) => {
      await this.processBarcodeScan(barcode);
    });
  }

  async checkOut() {
    const user = this.scannedUser();
    const cards = this.scannedCards();
    if (user == null || cards.length == 0) return;

    if (this.borrower === '') {
      const response = await firstValueFrom(this.dialogService.confirm('Are you sure you want to checkout ordinance card(s) to yourself.'));
      if (response !== true) return;
    }

    const checkOutDate = new Date().toISOString();
    for (var card of cards) {
      await this.db.updateCard({Id: card.Id, BarCode: card.BarCode, Title: card.Title, Language: card.Language, CheckedOut: 1, CheckedOutBy: user.Name, CheckedOutTo: this.borrower, CheckedOutAt: checkOutDate});
      await this.db.createLog({Id: 0, Timestamp: checkOutDate, Action: 'CheckOut', UserId: user.Id, CardId: card.Id});
    }
    
    this.state.updateCardCount();
    const dialog: Dialog = {
      type: DialogType.Info,
      message: 'Checkout complete',
      autoClose: 5
    }
    await firstValueFrom(this.dialogService.open(dialog));
    setTimeout(() => {
      this.resetScannedUser();
      this.resetScannedCard();
    }, 750);
  }

  async checkIn(card: OrdinanceCard) {
    if (!card) return;
    const checkInDate = new Date().toISOString();
    const userId = await this.db.getUserIdFromLastCheckoutByCardId(card.Id);
    await this.db.updateCard({Id: card.Id, BarCode: card.BarCode, Language: card.Language, CheckedOut: 0, CheckedOutBy: undefined, CheckedOutTo: undefined, CheckedOutAt: undefined});
    await this.db.createLog({Id: 0, Timestamp: checkInDate, Action: 'CheckIn', UserId: userId, CardId: card.Id});
    this.state.updateCardCount();
    const dialog: Dialog = {
      type: DialogType.Info,
      message: 'Card returned',
      autoClose: 3
    }
    await firstValueFrom(this.dialogService.open(dialog));
    setTimeout(() => {
      this.resetScannedUser();
      this.resetScannedCard();
    }, 750);
  }

  async processBarcodeScan(barcode: string) {
    const card = await this.db.getCard(barcode);
    const user = await this.db.getUser(barcode);
    if (this.scannedUser() == null && card?.CheckedOut === 1) { //Barcode in a card that is already checked out. Check it in
      this.checkIn(card);
    } else if (card) { //Barcode is a card. Add to list to check out later
      this.scannedCards.update(x => {
        if (!x.find(y => y.Id === card.Id)) x.push(card);
        return [...x];
      });
    } else if (user) { //Barcode is a user. Set scanned user
      this.scannedUser.set(user);
    } else { //Unknown barcode
      const choices = [
        {'key': 'CreateUser', 'value': 'Create worker'},
        //{'key': 'CreateCard', 'value': 'Create card'}
      ];
      const response = await firstValueFrom(this.dialogService.choice(['Barcode not recognized. If this is a new worker, please create a new worker'], choices));
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
    this.scannedCards.set([]);
  }

  removeScannedCard(id: number) {
    this.scannedCards.update(x => x.filter(y => y.Id !== id));
  }
}
