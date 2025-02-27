import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DialogService } from '@dannyboyng/dialog';
import { DatabaseService } from '../../services/database.service';
import { GlobalStateService } from '../../services/global-state.service';
import { Log } from '../../interfaces/log.interface';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-logs',
  imports: [MatTableModule, DatePipe, CommonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent {
  
  readonly dialog = inject(MatDialog);
  dialogService = inject(DialogService);
  state = inject(GlobalStateService);
  db = inject(DatabaseService);
  
  displayedColumns: string[] = ['date', 'action', 'card', 'user'];
  dataSource: WritableSignal<Log[]> = signal([]);

  async ngOnInit() {
    await this.getLogs();
  }

  async getLogs() {
    const result = await this.db.getLogs();
    this.dataSource.set(result);
  }


}
