import { Injectable } from '@angular/core';
import { Permiso } from '../../emp/entities/permiso'
import { endPoints } from '../../../../environments/environment'
import { ServiceCRUD } from '../../com/services/service-crud.service'

export class PermisoService extends ServiceCRUD<Permiso> {

  findAllByPerfil(perfilId: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.PermisoService + "perfil/" + perfilId)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }

  getClassName() : string{
    return "PermisoService";
  }
}