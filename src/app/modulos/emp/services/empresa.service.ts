import { Injectable } from '@angular/core';
import { Empresa } from './../entities/empresa'

import { endPoints } from '../../../../environments/environment'
import { ServiceCRUD } from '../../com/services/service-crud.service'

@Injectable()
export class EmpresaService extends ServiceCRUD<Empresa>{

  obtenerContratistas<Empresa>(empresaId: string) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "contratistas/" + empresaId)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }

  vincularContratista(contratista: Empresa) {
    let entity = new Empresa();
    entity.id = contratista.id;
    let body = JSON.stringify(entity);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + "contratistas", body)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }

  findByUsuario(usuarioId: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.EmpresaService + "usuario/" + usuarioId)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => console.log(err)
        )
    });
  }

  getClassName(): string {
    return "EmpresaService";
  }

}