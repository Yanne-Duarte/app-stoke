import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const myGuardGuard: CanActivateFn = (route, state) => {
  let perfil = '';
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[];

  // Get role from localStorage
  const user = localStorage.getItem('user') || '';

  if (user) {
    const userData = JSON.parse(user);
    perfil = userData.perfil; 
  }

  if (!perfil || !allowedRoles.includes(perfil)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
