import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { fornecedorGuard } from './fornecedor.guard';

describe('fornecedorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => fornecedorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
