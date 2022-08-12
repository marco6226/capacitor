import { Router } from '@angular/router';
import { SesionService } from './../../com/services/sesion.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MensajeUsuarioService } from './../../com/services/mensaje-usuario.service';
import { HttpInt } from './../../com/services/http-int.service';
import { Injectable } from '@angular/core';
import { endPoints } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeguimientosService {

  httpInt;
  headers;

  constructor(
    httpInt: HttpInt,
    mensajeUsuarioService: MensajeUsuarioService,
    private http: HttpClient,
    public sesionService: SesionService,
    router:Router,
  ) { }

  getClassName(): string {
    return "SeguimientoService";
  }

  getRequestHeaders(headers?: HttpHeaders): any {
    if (headers == null)
        headers = new HttpHeaders().set('Content-Type', 'application/json');

    headers = headers
        .set('Param-Emp', this.sesionService.getParamEmp())
        .set('app-version', this.sesionService.getAppVersion())
        .set('Authorization', this.sesionService.getBearerAuthToken());
    return { 'headers': headers };
}

  public getSegByTareaID(id) {
    return this.http.get(`${endPoints.tareaService}follow/${id}`, this.getRequestHeaders(this.headers)).toPromise();
  }

  public getEvidences(id, type) {
    return this.http.get(`${endPoints.tareaService}follow/download/${id}/${type}`, this.getRequestHeaders(this.headers)).toPromise();
  }

  public closeTarea(tarea) {
    return this.http.put(`${endPoints.tareaService}tarea/close`, tarea, this.getRequestHeaders(this.headers)).toPromise();
  }

  public createSeg(seg) {
    return this.http.post(`${endPoints.tareaService}follow`, seg, this.getRequestHeaders(this.headers)).toPromise();
  }

}
