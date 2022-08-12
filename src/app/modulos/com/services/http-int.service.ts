import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SesionService } from '../services/sesion.service'

@Injectable()
export class HttpInt {
  

  constructor(public http: HttpClient, private sesionService: SesionService) { }

  get(url: string, options?: HttpHeaders): Observable<Object> {
    return this.http.get(url, this.getRequestHeaders(options));
  }

  post(url: string, body: any, options?: HttpHeaders): Observable<Object> {
    return this.http.post(url, body, this.getRequestHeaders(options));
  }

  postFile(url: string, body: any, options?: HttpHeaders): Observable<Object> {
    options = new HttpHeaders()
      .set('Param-Emp', (this.sesionService.getEmpresa() == null ? null : this.sesionService.getEmpresa().id));
    return this.http.post(url, body, this.getRequestHeaders(options));
  }

  put(url: string, body: any, options?: HttpHeaders): Observable<Object> {
    return this.http.put(url, body, this.getRequestHeaders(options));
  }

  delete(url: string, options?: HttpHeaders): Observable<Object> {
    return this.http.delete(url, this.getRequestHeaders(options));
  }

  getRequestHeaders(headers?: HttpHeaders): any {
    if (headers == null)
      headers = new HttpHeaders().set('Content-Type', 'application/json');

    headers = headers
      .set('Param-Emp', this.sesionService.getParamEmp())
      .set('app-version', this.sesionService.getAppVersion())
      .set('Authorization', this.sesionService.getBearerAuthToken());
    return { 'headers': headers, withCredentials: true, origin: true, timeout: 10000 };
  }

  getSesionService() {
    return this.sesionService;
  }
}