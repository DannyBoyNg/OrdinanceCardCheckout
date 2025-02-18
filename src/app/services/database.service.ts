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

  connect() {

  }

  disconnect() {
    
  }

  getUsers() {

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
