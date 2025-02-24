import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DialogService } from '@dannyboyng/dialog';
import { firstValueFrom } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { DatabaseService } from '../../services/database.service';
import { CreateEditCardDialogComponent } from './create-edit-card-dialog/create-edit-card-dialog.component';
import { OrdinanceCard } from '../../interfaces/ordinace-card.interface';

@Component({
  selector: 'app-ordinance-cards',
  imports: [MatTableModule],
  templateUrl: './ordinance-cards.component.html',
  styleUrl: './ordinance-cards.component.css'
})
export class OrdinanceCardsComponent {
 readonly dialog = inject(MatDialog);
  dialogService = inject(DialogService);
  db = inject(DatabaseService);
  displayedColumns: string[] = ['code', 'language', 'status', 'action'];
  dataSource: WritableSignal<OrdinanceCard[]> = signal([]);

  async ngOnInit() {
    await this.getCards();
  }

  async getCards() {
    const result = await this.db.getCards();
    console.log(result);
    this.dataSource.set(result);
  }

  createCard() {
    this.dialog.open(CreateEditCardDialogComponent, 
      {
        position: {top: '100px'},
        maxWidth: '100%',
        data: {
          mode: 'Create',
        },
      }
    ).afterClosed().subscribe(async (result) => {
      if (result?.updateCaller) {
        await this.getCards();
      }
    });
  }

  editCard(user: User) {
    this.dialog.open(CreateEditCardDialogComponent, 
      {
        position: {top: '100px'},
        maxWidth: '100%',
        data: {
          mode: 'Edit',
          user: user,
        },
      }
    ).afterClosed().subscribe(async (result) => {
      if (result?.updateCaller) {
        await this.getCards();
      }
    });
  }

  async deleteUser(id: number) {
    const result = await firstValueFrom(this.dialogService.confirm('Are you sure you want to delete this user?'));
    if (result === true) {
      //Delete card
      await this.db.deleteCard(id);
      await this.getCards();
    }
  }  
}
