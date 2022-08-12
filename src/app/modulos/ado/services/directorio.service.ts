import { Injectable } from '@angular/core';

import { endPoints } from '../../../../environments/environment';
import { ServiceCRUD } from '../../com/services/service-crud.service';
import { RequestOptions } from '@angular/http';
import { Directorio } from '../entities/directorio';
import { Documento } from '../entities/documento';
import { FilterQuery } from '../../com/entities/filter-query';
import { HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { MensajeUsuarioService } from '../../com/services/mensaje-usuario.service';
// import { HttpInt } from '../../com/services/http-int.service';

@Injectable()
export class DirectorioService extends ServiceCRUD<Directorio>{



  // fileTransfer: FileTransferObject;

  // constructor(
  //   public transfer: FileTransfer,
  //   public httpInt: HttpInt,
  //   public mensajeUsuarioService: MensajeUsuarioService
  // ) {
  //   super(httpInt, mensajeUsuarioService);
  //   this.fileTransfer = this.transfer.create();
  // }


  uploadEndPoint: string = endPoints[this.getClassName()] + "upload";

  findByFilter(filterQuery?: FilterQuery, modulo?: string) {
    let endPoint = modulo == null ? this.end_point + '?' : this.end_point + modulo + '?'
    return new Promise(resolve => {
      this.httpInt.get(endPoint + this.buildUrlParams(filterQuery))
        .subscribe(
          res => resolve(res),
          err => this.manageError(err)
        )
    });
  }


  upload(fileToUpload: File, directorioPadreId: string, modulo: string, modParam: string, manejarError?: boolean, docMetaData?: Documento) {
    let endPoint = modulo == 'cop' ? this.end_point + 'cop/upload' : this.end_point + 'upload';
    let formData: FormData = new FormData();

    if (fileToUpload != null)
      formData.append('file', fileToUpload, fileToUpload.name);
    if (modulo != null)
      formData.append("mod", modulo);
    if (modParam != null)
      formData.append("modParam", modParam);
    if (directorioPadreId != null)
      formData.append("dpId", directorioPadreId);
    if (docMetaData != null)
      formData.append("docMetaData", JSON.stringify(docMetaData))

    return new Promise((resolve, reject) => {
      this.httpInt.postFile(endPoint, formData)
        .pipe(timeout(120000))
        .subscribe(
          res => resolve(res),
          err => {
            if (manejarError == null || manejarError == true)
              this.manageError(err);
            reject(err);
          }
        )
    });
  }

  uploadv2(fileToUpload: File, modulo) {

    let endPoint = modulo == 'cop' ? this.end_point + 'cop/upload' : this.end_point + 'uploadv2';

    let formData: FormData = new FormData();

    if (fileToUpload != null)
        formData.append('file', fileToUpload, fileToUpload.name);
    if (modulo != null)
        formData.append("mod", modulo);

    return new Promise((resolve) => {
        this.httpInt
            .postFile(endPoint, formData)
            .subscribe(
                (res) => {
                    resolve(res);
                },
                (err) => this.manageError(err)
            );
    });
  }

  removerDocumento(documentoId: string) {
    return new Promise(resolve => {
      this.httpInt.delete(this.end_point + 'documento/' + documentoId)
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }

  actualizarDirectorio(entity: Directorio) {
    let body = JSON.stringify(entity);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point, body)
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }

  actualizarDocumento(entity: Documento) {
    let body = JSON.stringify(entity);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + "documento", body)
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }

  eliminarDocumento(id: string) {
    return new Promise(resolve => {
      let end_point =
        this.httpInt.delete(this.end_point + "documento/" + id)
          .subscribe(
            res => {
              resolve(res);
            }
            ,
            err => this.manageError(err)
          )
    });
  }

  buscarDocumentos(parametro: string) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "buscarDocumentos/" + parametro)
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }

  findByUsuario() {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "usuario/")
        .subscribe(
          res => {
            resolve(res);
          }
          ,
          err => this.manageError(err)
        )
    });
  }

  download(directorioId: string, modulo?: string) {
    let endPoint = modulo == null ? this.end_point + "download/" : this.end_point + modulo + "/download/";
    return new Promise((resolve, reject) => {
      let options: any = {
        responseType: 'blob',
        headers: new HttpHeaders()
          .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
          .set('app-version', this.httpInt.getSesionService().getAppVersion())
          .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken())
          .set('content-type', 'application/octet-stream'),
        withCredentials: true
      };
      this.httpInt.http.get(endPoint + directorioId, options)
        .pipe(timeout(90000))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageBlobError(err);
            reject(err)
          }
        )
    });
  }

  /* ****************************************************************** */


  subirArchAnalisis(file: File, modParam: string, docMetadata: Documento): any {
    let formData: FormData = new FormData();
    if (file != null)
      formData.append('file', file, file.name);
    if (modParam != null)
      formData.append("modParam", modParam);
    if (docMetadata != null)
      formData.append("docMetaData", JSON.stringify(docMetadata))

    return new Promise((resolve, reject) => {
      this.httpInt.postFile(this.end_point + 'analisisDesviacion/upload/', formData)
        .subscribe(
          res => resolve(res),
          err => reject(err)
        )
    });
  }

  descargarArchAnalisis(documentoId: string): any {
    return new Promise((resolve, reject) => {
      let options: any = {
        responseType: 'blob',
        headers: new HttpHeaders()
          .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
          .set('app-version', this.httpInt.getSesionService().getAppVersion())
          .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken())
          .set('content-type', 'application/octet-stream'),
        withCredentials: true
      };
      this.httpInt.http.get(this.end_point + 'analisisDesviacion/download/' + documentoId, options)
        .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageBlobError(err);
            reject(err)
          }
        )
    });
  }

  actualizarArchAnalisis(entity: Documento): any {
    let body = JSON.stringify(entity);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + "analisisDesviacion", body)
        .subscribe(
          res => resolve(res),
          err => this.manageError(err)
        )
    });
  }


  eliminarArchAnalisis(documentoId: string): any {
    return new Promise(resolve => {
      this.httpInt.delete(this.end_point + "analisisDesviacion/" + documentoId)
        .subscribe(
          res => resolve(res),
          err => this.manageError(err)
        )
    });
  }

  getClassName(): string {
    return "DirectorioService";
  }

}
