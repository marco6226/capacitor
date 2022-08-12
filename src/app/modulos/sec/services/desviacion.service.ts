import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service'
import { SistemaCausaRaiz } from '../../sec/entities/sistema-causa-raiz'
import { FilterQuery } from '../../com/entities/filter-query';

@Injectable()
export class DesviacionService extends ServiceCRUD<SistemaCausaRaiz>{

    findInpByFilter(filterQuery?: FilterQuery) {
        return new Promise(resolve => {
            this.httpInt.get(this.end_point + 'inspecciones/?' + this.buildUrlParams(filterQuery))
                .subscribe(
                    res => {
                        resolve(res);
                    }
                    ,
                    err => this.manageError(err)
                )
        });
    }
    getClassName(): string {
        return "DesviacionService";
    }

}
