import { Injectable } from '@angular/core';
import { ServiceCRUD } from './service-crud.service';
import { ConfiguracionGeneral } from '../entities/configuracion-general';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracionGeneralService extends ServiceCRUD<ConfiguracionGeneral>{

    obtenerPorEmpresa() {
        return new Promise((resolve, reject) => {
            this.httpInt.get(this.end_point + 'empresa')
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
        return 'ConfiguracionGeneralService';
    }
}
