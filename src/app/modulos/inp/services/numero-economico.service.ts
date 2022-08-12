import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service';
import { NumeroEconomico } from '../entities/numero-economico';

@Injectable()
export class NumeroEconomicoService extends ServiceCRUD<NumeroEconomico>{

  // create(entity: Inspeccion) {
  //   let body = JSON.stringify(entity);
  //   return new Promise(resolve => {
  //     this.httpInt.post(this.end_point, body)
  //       .subscribe(
  //         res => {
  //           let inp = <Inspeccion>res;
  //           if (inp.id != null) {
              
  //           }
  //           resolve(res);
  //         }
  //         ,
  //         err => this.manageError(err)
  //       )
  //   });
  // }

  getClassName(): string {
    return "NumeroEconomicoService";
  }
}
