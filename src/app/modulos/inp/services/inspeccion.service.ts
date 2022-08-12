import { Bitacora } from './../entities/bitacora';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service'
import { Inspeccion } from '../entities/inspeccion';
import { timeout } from 'rxjs/operators';
import { FilterQuery } from '../../com/entities/filter-query';
import { Criteria } from '../../com/entities/filter';

@Injectable()
export class InspeccionService extends ServiceCRUD<Inspeccion>{

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
    return "InspeccionService";
  }

  getNumeroEconomico() {

    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point+'numeroEconomico')
        // .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  getNumeroEconomicoByInspeccion(numeroEconomico: string) {

  return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point+`numeroEconomico${numeroEconomico}`)
        // .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  getBitacora(numeroEconomicoId: string, inspeccionId: string) {

    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point+`bitacora/${numeroEconomicoId}/${inspeccionId}`)
        // .pipe(timeout(this.timeout))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  setBitacora(bitacora: Bitacora) {

    return new Promise((resolve, reject) => {
      let body = JSON.stringify(bitacora);
      this.httpInt.post(this.end_point+`bitacora`,body)
        // .pipe(timeout(this.timeout))
        .subscribe(
          res => {
            console.log(res)
            resolve(res)
          },
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

}
