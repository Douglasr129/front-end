import { CanActivateFn } from '@angular/router';

export const baseGuard: CanActivateFn = (route, state) => {
  return true;
};
