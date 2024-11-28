import { Routes, RouterModule } from '@angular/router';
import { AccountAppComponent } from './account-app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AccountGuard } from './services/account.guard';

const routes: Routes = [
  {  
    path: '', component: AccountAppComponent,
    children: [
      { path: 'sign-up', component: SignUpComponent, canActivate: [AccountGuard], canDeactivate: [AccountGuard]},
      { path: 'sign-in', component: SignInComponent, canActivate: [AccountGuard]},
    ]
  },
];

export const accountRoutes = routes;
