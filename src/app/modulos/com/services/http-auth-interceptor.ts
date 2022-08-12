import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { SesionService } from './sesion.service'
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { MensajeUsuario } from '../entities/mensaje-usuario';
import { CambioPasswdService } from '../services/cambio-passwd.service';
import { MensajeUsuarioService } from './mensaje-usuario.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

  inflightAuthRequest: Observable<HttpEvent<any>> = null;

  constructor(
    public sesionService: SesionService,
    public authService: AuthService,
    public cambioPasswdService: CambioPasswdService,
    public mensajeUsuarioService: MensajeUsuarioService,
    public router: Router,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status == 0) {
          return throwError(error);
        }
        let msg: MensajeUsuario;
        if (req.params != null && req.responseType == 'blob') {
          // Si el tipo de response es blob, se debe leer la respuesta como un blob
          var reader = new FileReader();
          // Se crea un nuevo observable debido a la naturaleza asincrona de la api FileReader
          let observ: Observable<HttpEvent<any>> = Observable.create(observer => {
            reader.onload = (): any => {
              try {
                msg = <MensajeUsuario>JSON.parse(<string>reader.result);
              } catch (error) {
                msg = { tipoMensaje: 'error', mensaje: 'Error Inesperado', detalle: <string>reader.result };
              }
              error['error'] = msg;
              observer.next();
              observer.complete();
            }
          }).pipe(switchMap(() => {
            return this.getObservable(msg, error, req, next);
          }));

          reader.readAsText(error.error);
          return observ;
        } else {
          // Por defecto se asume la respuesta como json
          msg = error.error;
          return this.getObservable(msg, error, req, next);
        }
      })
    );

  }

  getObservable(msg: MensajeUsuario, error, req, next): Observable<HttpEvent<any>> {
    switch (msg.codigo) {
       case 1_001:
        this.authService.logout();               
                    
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 1000);
        this.inflightAuthRequest = this.authService.refreshToken();
        if (!this.inflightAuthRequest) {
          return throwError(error);
        }
        //}
        return <Observable<HttpEvent<any>>>this.inflightAuthRequest.pipe(
          switchMap(res => {

            // unset inflight request
            this.inflightAuthRequest = null;

            // clone the original request
            let paramEmp = req.headers.get('param-emp') != null ? '' + req.headers.get('param-emp') : '';
            let headers = new HttpHeaders({
              'authorization': this.sesionService.getBearerAuthToken(),
              'app-version': this.sesionService.getAppVersion(),
              'param-emp': paramEmp,
              'content-type': req.headers.get('content-type')
            });
            const authReqRepeat = req.clone({ headers });
            return next.handle(authReqRepeat);
          })
        );
      case 1_002: 
                    
                    
        setTimeout(() => {
            this.router.navigate(['/login']);
            return;
        }, 1000);
         
return
      case 1_004: 
                         this.authService.logout();     
        setTimeout(() => {
            this.router.navigate(['/login']);
            return;
        }, 1000);     

      case 2_001:
        this.mensajeUsuarioService.showMessage({ mensaje: 'Contraseña expirada', detalle: 'Su contraseña ha expirado, por favor realice el cambio', tipoMensaje: 'warn' });
        this.cambioPasswdService.setVisible(true);
        return <Observable<HttpEvent<any>>>this.cambioPasswdService.getSubmitObservable().pipe(
          switchMap(res => {
            // clone the original request
            const authReqRepeat = req.clone();
            return next.handle(authReqRepeat);
          })
        );;
      default:
        return throwError(error);
    }
  }
}