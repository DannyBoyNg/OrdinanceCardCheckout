import { ChangeDetectionStrategy, Component, HostListener, inject, ViewContainerRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DialogService } from '@dannyboyng/dialog';
import { GlobalStateService } from './services/global-state.service';
import { DatabaseService } from './services/database.service';

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
    this.barcodeScanner$.subscribe(async (barcode) => {
      console.log('Barcode scanned: ', barcode);

      //Check if the barcode is an existing user or ordinance card
      //const users = await this.db.getUsers();
      //const cards = await this.db.getCards();
      //const user = users.find(u => u.BarCode === barcode);
      //const card = cards.find(c => c.BarCode === barcode);

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