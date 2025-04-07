import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

let cachedUserRole: string | null = null;

export const myGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[];

  // Se não houver roles definidas, permite acesso
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Usa o cache se disponível
  if (cachedUserRole) {
    return allowedRoles.includes(cachedUserRole);
  }

  // Get role from localStorage
  const user = localStorage.getItem('user');
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const userData = JSON.parse(user);
    cachedUserRole = userData.perfil;

    if (!cachedUserRole || !allowedRoles.includes(cachedUserRole)) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error parsing user data:', error);
    router.navigate(['/login']);
    return false;
  }
};
