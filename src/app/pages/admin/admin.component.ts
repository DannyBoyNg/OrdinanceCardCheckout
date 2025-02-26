import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { GlobalStateService } from '../../services/global-state.service';
import { firstValueFrom, Subject, takeUntil, timer } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { DialogService } from '@dannyboyng/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, MatProgressSpinnerModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  autoUnsubscribe = new Subject<void>();

  state = inject(GlobalStateService);
  db = inject(DatabaseService);
  dialog = inject(DialogService);
  router = inject(Router);
  adminUserId = signal(0);

  ngOnInit() {
    //Listen for barcode scanner
    this.state.barcodeScanner$
    .pipe(takeUntil(this.autoUnsubscribe))
    .subscribe(async (barcode) => {
      //If no users in database, let user pass
      const users = await this.db.getUsers();
      if (users.length === 0) {
        if (this.adminUserId() === 0) this.dialog.info(['No users found in the database. Please create a user.', 'The first user created will become an admin.']);
        this.adminUserId.set(1);
        return;
      }
      //Check if user is an admin
      const user = await this.db.getUser(barcode);
      if (user && user.Admin === 1) {
        this.adminUserId.set(user.Id);
      } else {
        if (this.adminUserId() === 0) {
          await firstValueFrom(this.dialog.error(['The scanned barcode is not an admin.']));
          this.router.navigate(['/']);
        }
      }
    });

    //Timer for closing page on no action or login for 1 minute
    timer(60000)
    .pipe(takeUntil(this.autoUnsubscribe))
    .subscribe(_ => {
      if (this.adminUserId() === 0) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.autoUnsubscribe.next();
    this.autoUnsubscribe.complete();
  }
}
