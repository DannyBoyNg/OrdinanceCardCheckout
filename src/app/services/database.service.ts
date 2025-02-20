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

  async getUsers(): Promise<User[]> {
    return await window.sqliteAPI.invoke('getUsers', null);
  }

  async createUser(user: User): Promise<User> {
    return await window.sqliteAPI.invoke('createUser', user);
  }

  async updateUser(user: User): Promise<User> {
    return await window.sqliteAPI.invoke('updateUser', user);
  }
  
  async deleteUser(id: number) {
    return await window.sqliteAPI.invoke('deleteUser', id);
  }

  async getCards(): Promise<OrdinanceCard[]> {  
    return await window.sqliteAPI.invoke('getCards', null);
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
