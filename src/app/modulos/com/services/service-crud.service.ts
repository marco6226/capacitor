import { Injectable } from '@angular/core';
import { HttpInt } from './http-int.service'
import { endPoints } from '../../../../environments/environment'
import { MensajeUsuarioService } from './mensaje-usuario.service'
import { MensajeUsuario } from '../entities/mensaje-usuario'
import { FilterQuery } from '../entities/filter-query'
import { timeout } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export abstract class ServiceCRUD<T> {

  public timeout = 30000;
  end_point: string = endPoints[this.getClassName()];

  constructor(
    public router: Router,
    public httpInt: HttpInt,
    public mensajeUsuarioService: MensajeUsuarioService
  ) {

  }

  abstract getClassName(): string;

  public buildUrlParams(filterQuery: FilterQuery): string {
    let urlParam = '';
    if (filterQuery == null) {
      return urlParam;
    }
    if (filterQuery.offset != null) {
      urlParam += 'offset=' + filterQuery.offset + '&';
    }
    if (filterQuery.rows != null) {
      urlParam += 'rows=' + filterQuery.rows + '&';
    }
    if (filterQuery.count != null) {
      urlParam += 'count=' + filterQuery.count + '&';
    }
    if (filterQuery.sortField != null) {
      urlParam += 'sortField=' + filterQuery.sortField + '&';
    }
    if (filterQuery.sortOrder != null) {
      urlParam += 'sortOrder=' + filterQuery.sortOrder + '&';
    }
    if (filterQuery.filterList != null) {
      urlParam += 'filterList=' + encodeURIComponent(JSON.stringify(filterQuery.filterList)) + '&';
    }
    if (filterQuery.fieldList != null) {
      let fieldParam = 'fieldList=';
      filterQuery.fieldList.forEach(field => {
        fieldParam += field + ',';
      });
      fieldParam.slice(0, fieldParam.length - 1);
      urlParam += fieldParam;
    }
    if (urlParam[urlParam.length - 1] === '&') {
      urlParam = urlParam.slice(0, urlParam.length - 1);
    }
    return urlParam;
  }

  findByFilter(filterQuery?: FilterQuery) {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + '?' + this.buildUrlParams(filterQuery))
        .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  buscarPorFiltro(filterQuery?: FilterQuery, mostrarError?: boolean) {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + '?' + this.buildUrlParams(filterQuery))
        .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            if (mostrarError)
              this.manageError(err);
            reject(err);
          }
        )
    });
  }

  count<T>(filterQuery?: FilterQuery) {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + "count?" + this.buildUrlParams(filterQuery))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  /**
   * Consulta la entidad teniendo como criterio el id pasado como parámetro.
   * @param id  
   */
  find(id: string) {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + id)
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }



  findAll<T>() {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point)
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  create(entity: T) {
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
      this.httpInt.post(this.end_point, body)
        .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  update(entity: T, params?: string) {
    let body = JSON.stringify(entity);
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point + (params == null ? '' : '?'.concat(params)), body)
        .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }


  delete(id: string) {
    return new Promise((resolve, reject) => {
      this.httpInt.delete(this.end_point + id)
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  manageError(err: any) {
    if (err.name != null && err.name == 'TimeoutError') {
      this.mensajeUsuarioService.showMessage({
        tipoMensaje: 'warn',
        mensaje: 'CONEXIÓN DEFICIENTE',
        detalle: 'La conexión está tardando mucho tiempo en responder, la solicitud ha sido cancelada. Por favor intentelo mas tarde.'
      });
      return;
    }
    if (err.status == 0) {
      this.mensajeUsuarioService.showMessage({
        tipoMensaje: 'warn',
        mensaje: 'ERROR DE CONEXIÓN',
        detalle: 'No se ha podido establecer conexión con el servidor. Por favor verifique que cuenta con conexión a internet.'
      });
      return;
    }
    let msg: MensajeUsuario;
    try {
      msg = <MensajeUsuario>err.error;
    } catch (error) {
      msg = { tipoMensaje: 'error', mensaje: 'Error Inesperado', detalle: err };
    }
    switch (msg.codigo) {
      case 1001:
        break;
      case 2_004:
        this.router.navigateByUrl('/appUpdate');
        break;
      default:
        this.mensajeUsuarioService.showMessage({
          mensaje: msg.mensaje,
          detalle: msg.detalle,
          tipoMensaje: msg.tipoMensaje
        });
        break;
    }
  }

  manageBlobError(err: any) {
    if (err.name != null && err.name == 'TimeoutError') {
      this.mensajeUsuarioService.showMessage({
        tipoMensaje: 'warn',
        mensaje: 'CONEXIÓN DEFICIENTE',
        detalle: 'La conexión está tardando mucho tiempo en responder, la solicitud ha sido cancelada. Por favor intente mas tarde.'
      });
      return;
    }
    if (err.error instanceof Blob) {
      let usrMsgService = this.mensajeUsuarioService;
      var reader = new FileReader();
      reader.onload = function () {
        let msg: MensajeUsuario;
        try {
          msg = <MensajeUsuario>JSON.parse(reader.result + '');
        } catch (error) {
          msg = { tipoMensaje: 'error', mensaje: 'Error Inesperado', detalle: reader.result + '' };
        }
        usrMsgService.showMessage({
          mensaje: msg.mensaje,
          detalle: msg.detalle,
          tipoMensaje: msg.tipoMensaje
        });
      }
      reader.readAsText(err.error);
    } else {
      this.manageError(err);
    }

  }

}