import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';

export function jwtInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
  const accountService = inject(AccountService);
  // add auth header with jwt if account is logged in and request is to the api url
  const account = accountService.accountValue;
  const isLoggedIn = account?.jwtToken;
  const isApiUrl = request.url.startsWith(environment.apiUrl);

  if (isLoggedIn && isApiUrl) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${account!.jwtToken}` }
    });
  }

  return next(request);
}
