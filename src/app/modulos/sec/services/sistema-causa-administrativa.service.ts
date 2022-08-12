import { Injectable } from '@angular/core';

import { ServiceCRUD } from '../../com/services/service-crud.service'
import { SistemaCausaAdministrativa } from '../entities/sistema-causa-administrativa';
import { timeout } from 'rxjs/operators';

@Injectable()
export class SistemaCausaAdministrativaService extends ServiceCRUD<SistemaCausaAdministrativa>{

    findDefault() {
        return new Promise((resolve, reject) => {
            this.httpInt.get(this.end_point + "seleccionado/")
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

    getClassName(): string {
        return "SistemaCausaAdministrativaService";
    }

}