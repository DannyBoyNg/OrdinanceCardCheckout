import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GlobalStateService } from '../../services/global-state.service';
import { Subject, takeUntil } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { DialogService } from '@dannyboyng/dialog';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  autoUnsubscribe = new Subject();

  state = inject(GlobalStateService);
  db = inject(DatabaseService);
  dialog = inject(DialogService);
  adminUserId = signal(0);

  ngOnInit() {
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
      } else if(this.adminUserId() === 0) {
        this.dialog.error(['The scanned barcode is not an admin.']);
      }
    });
  }
}
