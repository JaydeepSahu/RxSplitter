import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> 
  {
    let apiKey = "Bearer " + localStorage.getItem('Token');
    request = request.clone({
      setHeaders: {
         'authorization': apiKey,
      },
    });
    return next.handle(request);
  }
}
