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
  title = 'OrdinanceCardCheckout';

  constructor() {
    this.dialogService.setViewContainerRef(this.vcr);

    if (this.isElectron()) {
      console.log('Running in Electron!');
    } else {
      console.log('Not running in Electron!');
    }
  }

  @HostListener('window:keypress', ['$event'])
  handleUsbScan(event: KeyboardEvent) {
    console.log(event);
  }

  isElectron() {
    //if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    //    return true;
    //}
    //if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    //    return true;
    //}
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }
    return false;
  }

}
