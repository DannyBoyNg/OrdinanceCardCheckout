import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { OrdinanceCardsComponent } from './pages/ordinance-cards/ordinance-cards.component';
import { LogsComponent } from './pages/logs/logs.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'users', component: UsersComponent },
    { path: 'cards', component: OrdinanceCardsComponent },
    { path: 'logs', component: LogsComponent },

];
