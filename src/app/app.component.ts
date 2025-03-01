import { ChangeDetectionStrategy, Component, HostListener, inject, signal, ViewContainerRef } from '@angular/core';
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
  clock = signal('');

  constructor() {
    this.dialogService.setViewContainerRef(this.vcr);
  }

  ngOnInit() {
    //Update total card count
    this.state.updateCardCount();

    this.startClock();
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

  startClock() {
    setInterval(() => {
      const d = new Date();
      this.clock.set(`${d.toLocaleTimeString()}`);
    }, 1000);
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