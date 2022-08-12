import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from '../../emp/entities/usuario';
import { Empresa } from '../../emp/entities/empresa';
import { Empleado } from '../../emp/entities/empleado';
import { Session } from '../entities/session';
import { session_config } from '../../../../environments/environment';
import { ConfiguracionGeneral } from '../entities/configuracion-general';


@Injectable()
export class SesionService {

  private session: Session;
  eventEmmiter: EventEmitter<any> = new EventEmitter();
  app_version: string;

  constructor(
    private router: Router,
  ) {

  }

  emitirEvento(evento: string, valor: any) {
    this.eventEmmiter.emit({ evento: evento, valor: valor });
  }

  getEventEmmiter() {
    return this.eventEmmiter;
  }

  public getUsuario(): Usuario {
    if (this.session == null) {
      this.session = <Session>JSON.parse(localStorage.getItem(session_config.session_id));
      if (this.session == null) return null;
    }
    return this.session.usuario;
  }

  public setUsuario(usuario: Usuario) {
    this.session.usuario = usuario;
    localStorage.setItem(session_config.session_id, JSON.stringify(this.session));
  }

  public getEmpleado(): Empleado {
    if (this.session == null) {
        this.session = <Session>JSON.parse(localStorage.getItem(session_config.session_id));
        if (this.session == null) return null;
    }
    return this.session.empleado;
}
public setEmpleado(empleado: Empleado) {
    this.session.empleado = empleado;
    localStorage.setItem(session_config.session_id, JSON.stringify(this.session));
}

  public getEmpresa(): Empresa {
    if (this.session == null) {
      this.session = <Session>JSON.parse(localStorage.getItem(session_config.session_id));
      if (this.session == null) return null;
    }
    return this.session.empresa;
  }

  public getParamEmp(): string {
    let empParam = this.getEmpresa();
    return empParam == null ? '' : '' + empParam.id;
  }

  public setEmpresa(empresa: Empresa) {
    this.session.empresa = empresa;
    localStorage.setItem(session_config.session_id, JSON.stringify(this.session));
  }

  public getRefreshToken(): string {
    return localStorage.getItem('refresh');
  }

  public setRefreshToken(refreshToken: string) {
    localStorage.setItem('refresh', refreshToken);
  }

  public getAuthToken(): string {
    return localStorage.getItem('auth');
  }

  public getBearerAuthToken(): string {
    let token = this.getAuthToken();
    return token == null ? '' : 'Bearer ' + token;
  }

  public setAuthToken(token: string) {
    localStorage.setItem('auth', token);
  }

  public setLoggedIn(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.session = this.session == null ? new Session() : this.session;
      this.session.isLoggedIn = true;
      localStorage.setItem(session_config.session_id, JSON.stringify(this.session));
    } else {
      this.session = null;
      localStorage.removeItem(session_config.session_id);
      localStorage.removeItem('refresh');
      localStorage.removeItem('empresasList');
      localStorage.removeItem('auth');
    }
  }

  public isLoggedIn(): boolean {
    if (this.session == null) {
      this.session = <Session>JSON.parse(localStorage.getItem(session_config.session_id));
      if (this.session == null) return false;
    }
    return this.session.isLoggedIn;
  }

  public getOfflineMode(): boolean {
    if (this.session == null) {
      this.session = <Session>JSON.parse(localStorage.getItem(session_config.session_id));
      if (this.session == null) return null;
    }
    return this.session.offlineMode;
  }

  public setOfflineMode(offlineMode: boolean) {
    this.session.offlineMode = offlineMode;
    localStorage.setItem(session_config.session_id, JSON.stringify(this.session));
  }

  public setPermisosMap(permisosMapa: any) {
    this.session.permisosMap = permisosMapa;
    localStorage.setItem(session_config.session_id, JSON.stringify(this.session));
  }

  public getPermisosMap(): Map<string, any> {
    if (this.session == null) {
      this.session = <Session>JSON.parse(localStorage.getItem(session_config.session_id));
      if (this.session == null) return null;
    }
    return this.session.permisosMap;
  }


  public setConfiguracionMap(configMap: any) {
    this.session.configuracion = configMap;
    localStorage.setItem(session_config.session_id, JSON.stringify(this.session));
  }

  public getConfiguracionMap(): any {
    if (this.session == null) {
      this.session = <Session>JSON.parse(localStorage.getItem(session_config.session_id));
      if (this.session == null) return null;
    }
    return this.session.configuracion;
  }

  public getConfigParam(codigo: string) {
    let config = this.getConfiguracionMap();
    if (config == null || config[codigo] == null) {
      switch (codigo) {
        case 'APROB_INVEST_OBSERV': return 'true';
        case 'FORM_PART_INVST': return 'true';
        case 'FORM_COSTOS_INVST': return 'true';
        case 'NOMB_MOD_INP': return 'Inspecciones';
        case 'NOMB_MOD_AUC': return 'Observaciones';
        case 'NOMB_MOD_COP': return 'COPASST';
        case 'NOMB_MOD_SEC': return 'Seguimiento y control';
        case 'NOMB_MOD_IND': return 'Indicadores';
        case 'NUM_MAX_FOTO_INP': return '3';
      }
      return null;
    } else {
      return config[codigo].valor;
    }
  }

  getAppVersion(): any {
    if (this.app_version == null)
      this.app_version = localStorage.getItem("app_version");

    if (this.app_version == null)
      this.app_version = "1.0.233";

    return this.app_version;
  }

}
