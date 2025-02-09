import { Injectable } from '@angular/core';
import Database from 'better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';

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

  insertUser() {

  }

  insertCard() {

  }

  checkOut() {

  }

  checkIn() {
    
  }

}
