import { Injectable } from '@angular/core';
import { OrdinanceCard } from '../interfaces/ordinace-card.interface';
import { User } from '../interfaces/user.interface';
import { Log } from '../interfaces/log.interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  //Users
  async getUsers(): Promise<User[]> {
    return await window.sqliteAPI.invoke('getUsers', null);
  }

  async getUser(barcode: string): Promise<User|undefined> {
    return await window.sqliteAPI.invoke('getUser', barcode);
  }

  async createUser(user: User): Promise<void> {
    return await window.sqliteAPI.invoke('createUser', user);
  }

  async updateUser(user: User): Promise<void> {
    return await window.sqliteAPI.invoke('updateUser', user);
  }
  
  async deleteUser(id: number): Promise<void> {
    return await window.sqliteAPI.invoke('deleteUser', id);
  }

  //Cards
  async getCards(): Promise<OrdinanceCard[]> {  
    return await window.sqliteAPI.invoke('getCards', null);
  }

  async getCard(barcode: string): Promise<OrdinanceCard|undefined> {
    return await window.sqliteAPI.invoke('getCard', barcode);
  }

  async createCard(card: OrdinanceCard): Promise<void> {
    return await window.sqliteAPI.invoke('createCard', card);
  }

  async updateCard(card: OrdinanceCard): Promise<void> {
    return await window.sqliteAPI.invoke('updateCard', card);
  }

  async deleteCard(id: number): Promise<void> {
    return await window.sqliteAPI.invoke('deleteCard', id);
  }

  //Logs
  async getLogs(): Promise<Log[]> {
    return await window.sqliteAPI.invoke('getLogs', null);
  }

  async createLog(log: Log): Promise<void> {
    return await window.sqliteAPI.invoke('createLog', log);
  }

  //Custom
  async getUserIdFromLastCheckoutByCardId(cardId: number): Promise<number> {
    const result = await window.sqliteAPI.invoke('getUserIdFromLastCheckOutByCardId', cardId);
    return result?.UserId;
  }

  async getUsedLanguagesList(): Promise<string[]> {
    return await window.sqliteAPI.invoke('getUsedLanguagesList', null);
  }

}
