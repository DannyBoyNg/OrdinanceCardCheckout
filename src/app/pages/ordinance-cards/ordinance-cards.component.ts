import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DialogService } from '@dannyboyng/dialog';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { CreateEditCardDialogComponent } from './create-edit-card-dialog/create-edit-card-dialog.component';
import { OrdinanceCard } from '../../interfaces/ordinace-card.interface';
import { GlobalStateService } from '../../services/global-state.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ordinance-cards',
  imports: [MatTableModule, DatePipe],
  templateUrl: './ordinance-cards.component.html',
  styleUrl: './ordinance-cards.component.css'
})
export class OrdinanceCardsComponent {

  readonly dialog = inject(MatDialog);
  dialogService = inject(DialogService);
  state = inject(GlobalStateService);
  db = inject(DatabaseService);
  
  displayedColumns: string[] = ['code', 'language', 'status', 'action'];
  dataSource: WritableSignal<OrdinanceCard[]> = signal([]);

  async ngOnInit() {
    await this.getCards();
  }

  async getCards() {
    const result = await this.db.getCards();
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
        this.state.updateCardCount();
      }
    });
  }

  editCard(card: OrdinanceCard) {
    this.dialog.open(CreateEditCardDialogComponent, 
      {
        position: {top: '100px'},
        maxWidth: '100%',
        data: {
          mode: 'Edit',
          card: card,
        },
      }
    ).afterClosed().subscribe(async (result) => {
      if (result?.updateCaller) {
        await this.getCards();
      }
    });
  }

  async deleteCard(id: number) {
    const result = await firstValueFrom(this.dialogService.confirm('Are you sure you want to delete this card?'));
    if (result === true) {
      //Delete card
      await this.db.deleteCard(id);
      await this.getCards();
      this.state.updateCardCount();
    }
  }  
}
