import { Injectable } from '@angular/core';

import { ServiceCRUD } from '../../com/services/service-crud.service'
import { Indicador } from '../entities/indicador';
import { ParametroIndicador, Kpi } from './../entities/kpi'
import { timeout } from 'rxjs/operators';


@Injectable()
export class IndicadorService extends ServiceCRUD<Indicador>{

    actualizarKpi(kpi: Kpi): any {
        let body = JSON.stringify(kpi);
        return new Promise((resolve, reject) => {
            this.httpInt.put(this.end_point + 'kpi/', body)
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

    consultarIndicador(param: ParametroIndicador) {
        let strParam = encodeURIComponent(JSON.stringify(param));
        return new Promise((resolve, reject) => {
            this.httpInt.get(this.end_point + 'data/?param=' + strParam)
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

    getClassName() {
        return "IndicadorService";
    }

}
