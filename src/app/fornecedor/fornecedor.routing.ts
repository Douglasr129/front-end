import { Routes, RouterModule } from '@angular/router';
import { FornecedorComponent } from './fornecedor.component';
import { ListaComponent } from './lista/lista.component';
import { NovoComponent } from './novo/novo.component';
import { fornecedorGuard } from './services/fornecedor.guard';
import { EditarComponent } from './editar/editar.component';
import { fornecedorResolver } from './services/fornecedor.resolver';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';

const routes: Routes = [
  {  path: '', component: FornecedorComponent,
    children: [
        { path: 'listar-todos', component: ListaComponent },
        {
            path: 'adicionar-novo', component: NovoComponent,
            canDeactivate: [fornecedorGuard],
            canActivate: [fornecedorGuard],
            data: [{ claim: { nome: 'Fornecedor', valor: 'Adicionar'}}]
        },
        {
            path: 'editar/:id', component: EditarComponent,
            canActivate: [fornecedorGuard],
            data: [{ claim: { nome: 'Fornecedor', valor: 'Atualizar' } }],
            resolve: {
                fornecedor: fornecedorResolver
            }
        },
        {
            path: 'detalhes/:id', component: DetalhesComponent,
            resolve: {
                fornecedor: fornecedorResolver
            }
        },
        {
            path: 'excluir/:id', component: ExcluirComponent,
            canActivate: [fornecedorGuard],
            data: [{ claim: { nome: 'Fornecedor', valor: 'Excluir' } }],
            resolve: {
                fornecedor: fornecedorResolver
            }
        }
    ] },
];

export const FornecedorRoutes = routes;
