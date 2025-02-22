import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditUserDialogComponent } from './create-edit-user-dialog/create-edit-user-dialog.component';
import { DialogService } from '@dannyboyng/dialog';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-users',
  imports: [MatTableModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  readonly dialog = inject(MatDialog);
  dialogService = inject(DialogService);
  db = inject(DatabaseService);
  displayedColumns: string[] = ['name', 'code', 'admin', 'action'];
  dataSource: WritableSignal<User[]> = signal([]);

  async ngOnInit() {
    await this.getUsers();
  }

  async getUsers() {
    const result = await this.db.getUsers();
    this.dataSource.set(result);
  }

  createUser() {
    this.dialog.open(CreateEditUserDialogComponent, 
      {
        position: {top: '100px'},
        maxWidth: '100%',
        data: {
          mode: 'Create',
        },
      }
    ).afterClosed().subscribe(async (result) => {
      if (result?.updateCaller) {
        await this.getUsers();
      }
    });
  }

  editUser(user: User) {
    this.dialog.open(CreateEditUserDialogComponent, 
      {
        position: {top: '100px'},
        maxWidth: '100%',
        data: {
          mode: 'Edit',
          user: user
        },
      }
    ).afterClosed().subscribe(async (result) => {
      if (result?.updateCaller) {
        await this.getUsers();
      }
    });
  }

  async deleteUser(id: number) {
    const result = await firstValueFrom(this.dialogService.confirm('Are you sure you want to delete this user?'));
    if (result === true) {
      await this.db.deleteUser(id);
      await this.getUsers();
    }
  }
}
