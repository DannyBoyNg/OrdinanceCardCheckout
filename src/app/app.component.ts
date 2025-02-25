import { ChangeDetectionStrategy, Component, HostListener, inject, ViewContainerRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DialogService } from '@dannyboyng/dialog';
import { GlobalStateService } from './services/global-state.service';
import { DatabaseService } from './services/database.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  dialogService = inject(DialogService);
  vcr = inject(ViewContainerRef);
  state = inject(GlobalStateService);
  db = inject(DatabaseService);

  barcodeScanner$ = this.state.barcodeScanner$;

  constructor() {
    this.dialogService.setViewContainerRef(this.vcr);
  }

  ngOnInit() {
    //Update total card count
    this.state.updateCardCount();

    //Listen for barcode scanner
    this.barcodeScanner$.subscribe(async (barcode) => {
      console.log('Barcode scanned: ', barcode);

      //Check if the barcode is an existing ordinance card that is currently checked out. If so, check in the card
      const cards = await this.db.getCards();
      const card = cards.find(c => c.BarCode === barcode);
      if (card?.CheckedOut === 1) {
        await this.db.updateCard({Id: card.Id, BarCode: card.BarCode, Language: card.Language, CheckedOut: 0, CheckedOutBy: undefined, CheckedOutAt: undefined});
        await firstValueFrom(this.dialogService.info(['Card returned']));
      }
    });
  }

  @HostListener('window:keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    this.state.onKeyEvent(event.key);
  }

  isElectron() {
    return (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0);
  }

  quit() {
    window.close();
  }

  injectBarcode() {
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

  injectBarcode2() {
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

//Electron API Typings
declare global {
  interface Window {
    sqliteAPI: {
      sendMessage: (message : string) => void;
      invoke: (channel: string, data: any) => Promise<any>;
    }
  }
}