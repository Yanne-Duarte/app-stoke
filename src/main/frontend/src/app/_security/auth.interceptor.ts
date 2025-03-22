// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment.production';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const apiUrl = `${environment.apiUrl}/api`;
  const isApiRequest = req.url.startsWith(apiUrl);
  const isLoginRequest = req.url.includes(`${apiUrl}/auth/login`);

  if (isApiRequest && !isLoginRequest && token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  return next(req);
};
