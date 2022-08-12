import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service'
import { SistemaCausaRaiz } from '../../sec/entities/sistema-causa-raiz'
import { timeout } from 'rxjs/operators';

@Injectable()
export class SistemaCausaRaizService extends ServiceCRUD<SistemaCausaRaiz>{

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
    return "SistemaCausaRaizService";
  }

}
