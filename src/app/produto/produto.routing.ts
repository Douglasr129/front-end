import { Routes } from '@angular/router';
import { ProdutoComponent } from './produto.component';
import { ListaComponent } from './lista/lista.component';
import { NovoComponent } from './novo/novo.component';
import { ProdutoGuard } from './services/produto.guard';
import { EditarComponent } from './editar/editar.component';
import { ProdutoResolver } from './services/produto.resolver';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';

const routes: Routes = [
    {
        path: '', component: ProdutoComponent,
        children: [
            { path: 'listar-todos', component: ListaComponent },
            {
                path: 'adicionar-novo', component: NovoComponent,
                canDeactivate: [ProdutoGuard],
                canActivate: [ProdutoGuard],
                data: [{ claim: { nome: 'Produto', valor: 'Adicionar' } }]
            },
            {
                path: 'editar/:id', component: EditarComponent,
                canActivate: [ProdutoGuard],
                data: [{ claim: { nome: 'Produto', valor: 'Atualizar' } }],
                resolve: {
                    produto: ProdutoResolver
                }
            },
            {
                path: 'detalhes/:id', component: DetalhesComponent,
                resolve: {
                    produto: ProdutoResolver
                }
            },
            {
                path: 'excluir/:id', component: ExcluirComponent,
                canActivate: [ProdutoGuard],
                data: [{ claim: { nome: 'Produto', valor: 'Excluir' } }],
                resolve: {
                    produto: ProdutoResolver
                }
            }
        ], 
        providers: [ProdutoResolver, ProdutoGuard]
    },
];

export const ProdutoRoutes = routes;
