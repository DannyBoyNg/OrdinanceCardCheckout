import { Injectable } from '@angular/core';
import Database from 'better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';
import { CheckOut } from '../interfaces/checkout.interface';
import { OrdinanceCard } from '../interfaces/ordinace-card.interface';
import { CheckIn } from '../interfaces/checkin.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private db: BetterSqlite3.Database|undefined;

  constructor() { }

  connect() {
    const options = {verbose: console.log};
    this.db = new Database('databaseV1.db', options);
    this.db.pragma('journal_mode = WAL');
  }

  disconnect() {
    this.db?.close();
  }

  getUsers() {
    const stmt = this.db?.prepare('SELECT * FROM users');
    return stmt?.all() as User[];
  }

  createUser(user: User) {

  }

  editUser(user: User) {

  }
  
  deleteUser(id: number) {

  }

  getCards() {  

  }

  createCard(card: OrdinanceCard) {

  }

  editCard(card: OrdinanceCard) {

  }

  deleteCard(id: number) {

  }

  checkOut(checkOut: CheckOut) {

  }

  checkIn(checkIn: CheckIn) {
    
  }

}
