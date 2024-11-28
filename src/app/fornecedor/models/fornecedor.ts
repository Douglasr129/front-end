import { Produto } from '../../produto/models/produto';
import { Endereco } from './endereco';


export interface Fornecedor {
    id?: string;
    nome?: string;
    documento?: string;
    ativo?: boolean;
    tipoFornecedor?: number;
    endereco?: Endereco;
    produtos?: Produto[]
}

