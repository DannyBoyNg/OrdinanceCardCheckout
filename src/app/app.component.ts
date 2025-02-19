import { ChangeDetectionStrategy, Component, HostListener, inject, ViewContainerRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DialogService } from '@dannyboyng/dialog';

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

  constructor() {
    this.dialogService.setViewContainerRef(this.vcr);
  }

  @HostListener('window:keypress', ['$event'])
  handleUsbScan(event: KeyboardEvent) {
    console.log(event);
  }

  isElectron() {
    return (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0);
  }

}

declare global {
  interface Window {
    sqliteAPI: {
      sendMessage: (message : string) => void;
      invoke: (channel: string, data: any) => Promise<any>;
    }
  }
}