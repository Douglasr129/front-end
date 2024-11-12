import { Routes } from '@angular/router';
import { HomeComponent } from './navigation/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {path: 'account',
        loadChildren: () => import('./account/account.routing').then(mod => mod.accountRoutes)
    }
];