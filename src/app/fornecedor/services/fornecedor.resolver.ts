import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { FornecedorService } from './fornecedor.service';
import { Fornecedor } from '../models/fornecedor';

@Injectable()
export class FornecedorResolver implements Resolve<Fornecedor> {
  constructor(private fornecedorService: FornecedorService) {}

  resolve(route: ActivatedRouteSnapshot){ 
    return this.fornecedorService.obterPorId(route.params['id']);
  }
}
