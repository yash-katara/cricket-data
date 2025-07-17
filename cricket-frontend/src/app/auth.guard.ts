import { CanActivateFn , Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthserviceService } from './authservice.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthserviceService);

  if (authService.isLoggedIn()) {

  return true;
  }
  else {
    router.navigate(['/login']);
    return false;
  }
};
