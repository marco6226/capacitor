import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service';
import { Usuario } from '../entities/usuario';


@Injectable()
export class UsuarioService extends ServiceCRUD<Usuario>{

  aceptarTerminos(acepta: boolean): any {
    try {
      return new Promise((resolve, reject) => {
        this.httpInt.put(this.end_point + 'terminos/' + acepta, null)
          .subscribe(
            res => {
              setTimeout(() => {
                resolve(res);                
              }, 3000);
            }
            ,
            err => {
              reject(err);
              this.manageError(err)
            }
          )
      });
    } catch (error) {
      
    }
    
  }

  consultarHistoriaLogin() {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'historiaLogin/')
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }


  cambiarPasswd(newPasswd: string, newPasswdConfirm: string, oldPasswd: string) {
    let body = { 'passwdAnterior': oldPasswd, 'passwdNuevo': newPasswd, 'passwdNuevoConfirm': newPasswdConfirm };
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point + 'cambiarPasswd', JSON.stringify(body))
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  /**
   * Modifica los datos de usuario por parte del mismo usuario.
   * No es permitido que un usuario modifique datos de otro a través
   * éste servicio
   * @param entity 
   */
  edit(entity: Usuario) {
    let body = JSON.stringify(entity);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + 'update', body)
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
    return "UsuarioService";
  }
}