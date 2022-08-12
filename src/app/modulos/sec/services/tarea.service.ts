import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service';
import { Tarea } from '../entities/tarea';
import { timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpInt } from '../../com/services/http-int.service';
import { SesionService } from '../../com/services/sesion.service'
import { MensajeUsuarioService } from '../../com/services/mensaje-usuario.service';
import { Router } from '@angular/router';

@Injectable()
export class TareaService extends ServiceCRUD<Tarea>{

  httpInt;
  headers;
  constructor(
    httpInt: HttpInt,
    mensajeUsuarioService: MensajeUsuarioService,
    private http: HttpClient,
    public sesionService: SesionService,
    router:Router,
) {
    super(router,httpInt, mensajeUsuarioService);
}
  reportarCumplimiento(tarea: Tarea) {
    let body = JSON.stringify(tarea);
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point + "reportarCumplimiento", body)
        .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            reject(err);
            this.manageError(err);
          })
    });
  }

  reportarVerificacion(tarea: Tarea) {
    let body = JSON.stringify(tarea);
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point + "reportarVerificacion", body)
        .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            reject(err);
            this.manageError(err);
          }
        )
    });
  }

  findByUsuario(usuarioId: string) {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'usuario/' + usuarioId)
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  public findByDetailId(tareaId: string) {
    return this.httpInt.get(`${this.end_point}detail/${tareaId}`, this.getRequestHeaders(this.headers)).toPromise();
}

public findByDetailsByEmpleado(id) {
 
  let a = this.http.get(this.end_point+'details/'+id, this.getRequestHeaders(this.headers)).toPromise();
  console.log();
  return a
}

public findByDetailsByAll(areas) {
 
  let a = this.http.get(this.end_point+'detalle/'+areas, this.getRequestHeaders(this.headers)).toPromise();
  console.log("todas",a);
  return a
}

  getClassName(): string {
    return "TareaService";
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

public getTareaEvidencesModulos(id, modulo) {
  return this.http.get(`${this.end_point}images/${id}/${modulo}`, this.getRequestHeaders(this.headers)).toPromise();
}

}