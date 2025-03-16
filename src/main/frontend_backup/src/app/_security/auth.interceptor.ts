import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment.production';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  console.log(token);

  // Get the API URL from environment
  const apiUrl = `${environment.apiUrl}/api`;

  // Check if the request is for our API
  const isApiRequest = req.url.startsWith(apiUrl);

  // Check if the request URL is for login or register
  const isAuthRequest =
    req.url.includes(`${apiUrl}/login`) ||
    req.url.includes(`${apiUrl}/register`);

  // If it's an API request, not an auth request, and we have a token, add it to the headers
  if (isApiRequest && !isAuthRequest && token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
