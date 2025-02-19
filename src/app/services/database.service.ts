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

  async getUsers() {
    return await window.sqliteAPI.invoke('getUsers', null);
  }

  async createUser(user: User) {
    return await window.sqliteAPI.invoke('createUser', user);
  }

  async updateUser(user: User) {
    return await window.sqliteAPI.invoke('updateUser', user);
  }
  
  async deleteUser(id: number) {
    return await window.sqliteAPI.invoke('deleteUser', id);
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
