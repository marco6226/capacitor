import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service'
import { AnalisisDesviacion } from '../entities/analisis-desviacion'

@Injectable()
export class AnalisisDesviacionService extends ServiceCRUD<AnalisisDesviacion>{

    findByTarea(tareaId: string) {
        return new Promise(resolve => {
            this.httpInt.get(this.end_point + 'tarea/' + tareaId)
                .subscribe(
                    res => resolve(res),
                    err => this.manageError(err)
                )
        });
    }

    getClassName(): string {
        return "AnalisisDesviacionService";
    }

}