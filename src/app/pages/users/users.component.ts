import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  MatDialog
} from '@angular/material/dialog';
import { CreateEditUserDialogComponent } from './create-edit-user-dialog/create-edit-user-dialog.component';
import { DialogService } from '@dannyboyng/dialog';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../interfaces/user.interface';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

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
  displayedColumns: string[] = ['id', 'name', 'code', 'admin', 'action'];
  dataSource: WritableSignal<User[]> = signal([]);

  constructor() {

  }

  getUsers() {
    const users = this.db.getUsers();
    //this.dataSource.set(users);
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
    );
  }

  editUser() {
    this.dialog.open(CreateEditUserDialogComponent, 
      {
        position: {top: '100px'},
        maxWidth: '100%',
        data: {
          mode: 'Edit',
        },
      }
    );
  }

  async deleteUser() {
    const result = await firstValueFrom(this.dialogService.confirm('Are you sure you want to delete this user?'));
    console.log(result);
  }
}
