import { Routes } from '@angular/router';
import { HomeComponent } from './navigation/home/home.component';
import { NotFoundComponent } from './navigation/not-found/not-found.component';
import { AccessRefusedComponent } from './navigation/access-refused/access-refused.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {path: 'account',
        loadChildren: () => import('./account/account.routing').then(mod => mod.accountRoutes)
    },
    {path: 'fornecedores',
        loadChildren: () => import('./fornecedor/fornecedor.routing').then(mod => mod.FornecedorRoutes)
    },
    {path: 'produtos',
        loadChildren: () => import('./produto/produto.routing').then(mod => mod.ProdutoRoutes)
    },
    { path: 'access-refused', component: AccessRefusedComponent },
    { path: '**', component: NotFoundComponent }
];