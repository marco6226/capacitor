import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInt } from '../../com/services/http-int.service';
import { MensajeUsuarioService } from '../../com/services/mensaje-usuario.service';
import { ServiceCRUD } from '../../com/services/service-crud.service'
import { SesionService } from '../../com/services/sesion.service';
import { ListaInspeccion } from '../entities/lista-inspeccion'
import { ListaInspeccionPK } from '../entities/lista-inspeccion-pk'

@Injectable({
  providedIn: 'root'
})
export class ListaInspeccionService extends ServiceCRUD<ListaInspeccion>{

  router;
  httpInt;
  headers; 

  constructor(
    httpInt: HttpInt,
    router: Router,
    mensajeUsuarioService: MensajeUsuarioService,
    private http: HttpClient,
    public sesionService: SesionService,
    ) {
        super(router, httpInt, mensajeUsuarioService) //REV
    }

  getClassName(): string {
    return "ListaInspeccionService";
  }

  findByPK(pk: ListaInspeccionPK) {
    return super.find(("id;id=" + pk.id + ";version=" + pk.version));
  }

  public getInspeccionImagen(lista_id, version_id) {
    return this.http.get(`${this.end_point}images/${lista_id}/${version_id}`, this.getRequestHeaders(this.headers)).toPromise();
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
}
