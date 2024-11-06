import { Routes, RouterModule } from '@angular/router';
import { AccountAppComponent } from './account-app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  {  
    path: '', component: AccountAppComponent,
    children: [
      { path: 'sign-up', component: SignUpComponent},
      { path: 'sign-in', component: SignInComponent},
    ]
  },
];

export const accountRoutes = routes;
