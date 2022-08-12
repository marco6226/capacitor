import { Injectable } from '@angular/core';
import { ServiceCRUD } from './service-crud.service';
import { Manual } from '../entities/manual';
import { HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ManualService extends ServiceCRUD<Manual>{

    descargar(man: Manual): any {
        return new Promise((resolve, reject) => {
            let endPoint = this.end_point + 'descargar/' + man.id;
            let options: any = {
                responseType: 'blob',
                headers: new HttpHeaders()
                    .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
                    .set('app-version', this.httpInt.getSesionService().getAppVersion())
                    .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken())
                    .set('content-type', 'application/octet-stream'),
                withCredentials: true
            };
            this.httpInt.http.get(endPoint, options)
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

    buscarPorUsuario() {
        return new Promise((resolve, reject) => {
            this.httpInt.get(this.end_point + 'usuario')
                .pipe(timeout(this.timeout))
                .subscribe(
                    res => {
                        resolve(res)
                    },
                    err => {
                        this.manageError(err);
                        reject(err);
                    }
                )
        });
    }

    getClassName() {
        return 'ManualService';
    }
}
