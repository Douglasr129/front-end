import { Routes } from '@angular/router';
import { FornecedorComponent } from './fornecedor.component';
import { ListaComponent } from './lista/lista.component';
import { NovoComponent } from './novo/novo.component';
import { FornecedorGuard } from './services/fornecedor.guard';
import { EditarComponent } from './editar/editar.component';
import { FornecedorResolver } from './services/fornecedor.resolver';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';

const routes: Routes = [
    {
        path: '', component: FornecedorComponent,
        children: [
            { path: 'listar-todos', component: ListaComponent },
            {
                path: 'adicionar-novo', component: NovoComponent,
                canDeactivate: [FornecedorGuard],
                canActivate: [FornecedorGuard],
                data: [{ claim: { nome: 'Fornecedor', valor: 'Adicionar' } }]
            },
            {
                path: 'editar/:id', component: EditarComponent,
                canActivate: [FornecedorGuard],
                data: [{ claim: { nome: 'Fornecedor', valor: 'Atualizar' } }],
                resolve: {
                    fornecedor: FornecedorResolver
                }
            },
            {
                path: 'detalhes/:id', component: DetalhesComponent,
                resolve: {
                    fornecedor: FornecedorResolver
                }
            },
            {
                path: 'excluir/:id', component: ExcluirComponent,
                canActivate: [FornecedorGuard],
                data: [{ claim: { nome: 'Fornecedor', valor: 'Excluir' } }],
                resolve: {
                    fornecedor: FornecedorResolver
                }
            }
        ], 
        providers: [FornecedorResolver, FornecedorGuard]
    },
];

export const FornecedorRoutes = routes;
