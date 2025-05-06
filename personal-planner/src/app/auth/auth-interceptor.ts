import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { inject, Injectable } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.jwtToken;
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  } else {
    return next(req);
  }
};