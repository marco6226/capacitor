import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service'
import { Observacion } from '../entities/observacion';

@Injectable({
  providedIn: 'root'
})
export class ObservacionService extends ServiceCRUD<Observacion>{

  getClassName(): string {
    return "ObservacionService";
  }


  guardarGestionObervacion(observacion: Observacion, estado: string){
    let body = JSON.stringify(observacion);
    return new Promise((resolve) => {
        this.httpInt
            .put(this.end_point + estado, body)
            .subscribe(
                (res) => {
                    resolve(res);
                },
                (err) => this.manageError(err)
            );
    });
  }

  download(directorioId: string, modulo?: string) {
    let endPoint = modulo == null ? this.end_point + "download/" : this.end_point + modulo + "/download/";
    return new Promise(resolve => {
        let options: any = {
            responseType: 'blob',
            headers: new HttpHeaders()
                .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
                .set('app-version', this.httpInt.getSesionService().getAppVersion())
                .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken()),
            withCredentials: true
        };
        this.httpInt.http.get(endPoint + directorioId, options)
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => this.manageBlobError(err)
            )
    });
}

}
