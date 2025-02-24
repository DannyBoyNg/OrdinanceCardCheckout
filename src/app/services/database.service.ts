import { Injectable } from '@angular/core';
import { CheckOut } from '../interfaces/checkout.interface';
import { OrdinanceCard } from '../interfaces/ordinace-card.interface';
import { CheckIn } from '../interfaces/checkin.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  //Users
  async getUsers(): Promise<User[]> {
    return await window.sqliteAPI.invoke('getUsers', null);
  }

  async getUser(barcode: string): Promise<User> {
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

  async getCard(barcode: string): Promise<OrdinanceCard> {
    return await window.sqliteAPI.invoke('getCard', barcode);
  }

  async createCard(card: OrdinanceCard) {
    return await window.sqliteAPI.invoke('createCard', card);
  }

  async updateCard(card: OrdinanceCard) {
    return await window.sqliteAPI.invoke('updateCard', card);
  }

  async deleteCard(id: number) {
    return await window.sqliteAPI.invoke('deleteCard', id);
  }

}
