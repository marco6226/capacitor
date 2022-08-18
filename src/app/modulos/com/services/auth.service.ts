import { Injectable } from '@angular/core';
import { HttpInt } from './http-int.service';
import { AES } from "crypto-js";
// import * as CryptoJS from 'crypto-js';
import { endPoints } from '../../../../environments/environment';
import { SesionService } from './sesion.service'
import { Subject } from 'rxjs';
import { NavController, AlertController } from '@ionic/angular';
import { timeout, map } from 'rxjs/operators';

// import { resolve } from 'dns';
import { MensajeUsuarioService } from './mensaje-usuario.service';
// import { Route } from '@angular/compiler/sr/core';
import { Route } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";



@Injectable()
export class AuthService {


  private subjectTerminos = new Subject<boolean>();
  private loginSubject = new Subject<any>();
  private loginSubmitSubject = new Subject<any>();

  authEndPoint = endPoints.auth;


  // store the URL so we can redirect after logging in
  redirectUrl: string = '/app/home';

  private Alert;

  constructor(
    private router: Router,
    public httpInt: HttpInt,
    private sesionService: SesionService,
    private msjUser: MensajeUsuarioService,
  ) {

  }

  public isLoggedIn(): boolean {
    return this.sesionService.isLoggedIn();
  }

  login(login: string, passwd: string, recordar: boolean, pin: string) {

    let body = login + ":" + this.createHash(passwd);
    return new Promise((resolve, reject) => {
      this.httpInt.post(this.authEndPoint + '?r=' + recordar + (pin != null ? '&pin=' + pin : ''), body)
        .pipe(timeout(20000))
        .subscribe(
          res => {
            this.setSession(res, recordar);
            resolve(res);
          },
          err => reject(err)
        );
    });
  }
  checkisLoginExist(login: string, passwd: string ){
    let body = login + ":" + this.createHash(passwd)
   return  this.httpInt.post(this.authEndPoint+ 'activetokens' + '?r=' + false + (false != null ? ("&pin=" + false) : ''), body).toPromise();
  }


  logout(redirectLogin?: boolean) {
    let isoffline = this.sesionService.getOfflineMode();
    this.sesionService.setOfflineMode(false);
    let refresh = this.sesionService.getRefreshToken();
    let auth = this.sesionService.getAuthToken();
    return new Promise((resolve, reject) => {
      this.httpInt.post(this.authEndPoint + 'logout', { 'Authorization': auth, 'refresh': refresh })
        .pipe(timeout(20000))
        .subscribe(
          res => {
            if (redirectLogin == true) this.setLoginFormVisible(true, false);
            this.sesionService.setLoggedIn(false);
            resolve(res);
          },
          err => {
            this.sesionService.setOfflineMode(isoffline);
            reject(err);
          }
        );
    });
  }

  resetPassword(email: any): any {
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.authEndPoint + 'recuperarPasswd/' + email)
        .subscribe(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  createHash(passw: string) {
    try {
      return CryptoJS.SHA256(passw, null);
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  setSession(res: any, recordar?: boolean) {
    this.sesionService.setLoggedIn(true);
    this.sesionService.setUsuario(res['usuario']);
    this.sesionService.setAuthToken(res['Authorization']);
    if (recordar != null && recordar == true && res['refresh'] != null) {
      this.sesionService.setRefreshToken(res['refresh']);
    }
  }

  consultarApiVersion() {
    let endpoint = this.authEndPoint + 'version';
    return new Promise((resolve, reject) => {
      this.httpInt.get(endpoint)
        .pipe(timeout(30000))
        .subscribe(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  consultarPoliticaDatos() {
    let endpoint = this.authEndPoint + 'politicaDatos';
    return new Promise((resolve, reject) => {
      this.httpInt.get(endpoint)
        .pipe(timeout(30000))
        .subscribe(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  consultarUpdateDisponible() {
    let respuesta = {};
    let version = this.sesionService.getAppVersion();
    respuesta['versionActual'] = version;
    return new Promise((resolve, reject) => {
      this.consultarApiVersion()
        .then(apiVersion => {
          let so = localStorage.getItem('plataforma');
          let versDisp = (so == 'ios' ? apiVersion['iosVersion'] : apiVersion['androidVersion']);
          respuesta['versionDisponible'] = versDisp;
          resolve(respuesta);
        })
        .catch(err => {
          respuesta['versionDisponible'] = version;
          resolve(respuesta);
        })
    });
  }

  requestRefresh(token: string) {
    let body = token;
    let endpoint = this.authEndPoint + 'refrescarToken';
    return new Promise((resolve, reject) => {
      this.httpInt.post(endpoint, body)
        .subscribe(
          res => {
            this.setSession(res, false);
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  /**
 * Método que intenta solicitar un nuevo token si se poseen las credenciales para hacerlo, si no,
 * emite un evento para visualizar el formulario de login para solicitar el ingreso al usuario
 */
  refreshToken(): Observable<any> {
    // Verifica si se posee el refresh_token para refrescar el token de acceso
    let refreshToken = this.sesionService.getRefreshToken();
    if (refreshToken != null && refreshToken != 'undefined') {
      this.requestRefresh(refreshToken).then(
        resp => this.onLogin(resp)
      ).catch(error => {
        this.setLoginFormVisible(true, true);
      })
      this.msjUser.showMessage({tipoMensaje:"info" , mensaje:"Lo sentimos se cerro su sesion", detalle:""})
     // 
      this.logout(); 
      localStorage.clear();      
     
     // this.setLoginFormVisible(true, true);
      return this.loginSubmitSubject.asObservable();
    } else {
      // Si no se posee passwd, visualiza el formulario de login
      this.setLoginFormVisible(true, true);
      return this.loginSubmitSubject.asObservable();
    }
  }

  /**
 * Emite el evento para visualizar o esconder el formulario de login
 * @param visible 
 */
  setLoginFormVisible(visible: boolean, modal?: boolean) {
    this.loginSubject.next({ 'visible': visible, 'modal': modal });
  }

  /**
 *  Devuelve el observable que indica cuando visualizar el formulario de login
 */
  getLoginObservable(): Observable<any> {
    return this.loginSubject.asObservable();
  }

  /**
   * Emite el evento que indica que el usuario se ha logueado correctamente
   * a través del formulario de login
   * @param res 
   */
  onLogin(res: any) {
    this.loginSubmitSubject.next(res);
  }


  getSubjectTerminos(): Subject<boolean> {
    return this.subjectTerminos;
  }

  sendNotificationhallazgosCriticos(id, nocumplecriticos,numeroeconomico,ubicacion) {
       
    // console.log("Send notificacion",id, nocumplecriticos)
    let body = nocumplecriticos;
    let endPoint = this.authEndPoint + 'enviarHallazgosCriticos/' + id + '/' + numeroeconomico  + '/' + ubicacion;
    return new Promise( (resolve) => {
        this.httpInt
            .post(endPoint , body)
            .pipe(map((res) => res))
            .subscribe(
                (res) => {
                    resolve(res);
                },
               
            );
    });
}

sendNotificationObservacionDenegada(email: string, observacion) {
  console.log("Enviar notificacion a: (" + email + ")");
  let body = observacion;
  let endpoint = this.authEndPoint + "enviarCorreoDenegada/" + email;
  return new Promise((resolve, reject) => {
      this.httpInt
          .post(endpoint, body)
          .pipe(
           map((res) => res))
          .subscribe(
              (res) => resolve(res),
              (err) => reject(err)
          );
      console.log("Enviada a:" + email);
  });
}

}
