import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SesionService } from '../../services/sesion.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MensajeUsuarioService } from '../../services/mensaje-usuario.service';
import { EmpresaService } from '../../../emp/services/empresa.service';
import { asyncLocalStorage } from '../../utils/util';
import { PermisoService } from '../../../emp/services/permiso.service';
import { ConfiguracionGeneral } from '../../entities/configuracion-general';
import { ConfiguracionGeneralService } from '../../services/configuracion-general.service';
import { Market } from '@ionic-native/market/ngx';
import { MensajeUsuario } from '../../entities/mensaje-usuario';

@Component({
  selector: 'sm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [EmpresaService, PermisoService, Market]
})
export class LoginComponent implements OnInit {

  contadorFallas = 0;
  relojText: string;
  intentosMax = 5;

  @Input("modal") modal: boolean;
  @Input("visible") visible: boolean = true;
  @Output('onLogin') onLogin = new EventEmitter<any>();
  subscription: Subscription;
  public form: FormGroup;
  passwdVisible: boolean = false;

  visibleLnkResetPasswd: boolean = true;
  visiblePin = false;

  version: string;
  versionDisponible: string;

  constructor(
    public market: Market,
    public alertController: AlertController,
    private configService: ConfiguracionGeneralService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public loadingController: LoadingController,
    private sesionService: SesionService,
    public msgUsuarioService: MensajeUsuarioService,
    private router: Router,
    private empresaService: EmpresaService,
    private permisoService: PermisoService
  ) {
    if (this.sesionService.getUsuario() != null && this.sesionService.getUsuario().fechaAceptaTerminos == null) {
      this.authService.getSubjectTerminos().next(true);
    }
    this.subscription = this.authService.getLoginObservable().subscribe(param => {
      this.visible = param.visible;
      this.modal = param.modal;
    });
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      passwd: ['', Validators.required],
      pin: [null]
    });

    this.authService.consultarUpdateDisponible()
      .then(resp => {
        this.version = resp['versionActual'];
        console.log(resp);
        this.versionDisponible = resp['versionDisponible'];
      });
  }

  ngOnInit() {
    if (this.sesionService.getEmpresa() != null && this.sesionService.getUsuario() != null) {
      if (this.sesionService.getUsuario().estado == 'CAMBIO_PASSWD') {
        this.consultarEmpresas(this.sesionService.getUsuario().id)
          .then(() => {
            this.visible = false;
            this.router.navigate([this.authService.redirectUrl]);
          });
      } else {
        this.router.navigate([this.authService.redirectUrl]);
      }
    } else {
      let countDown = Number(localStorage.getItem('countDown'));
      if (countDown != null && countDown > 0) {
        this.contadorFallas = 5;
        this.iniciarContador(countDown);
      }
    }
  }

  consultarEmpresas(idUsuario) {
    return new Promise<void>((resolve, reject) => {
      this.empresaService.findByUsuario(idUsuario).then(
        resp => {
          let empresasList = <any[]>resp;
          asyncLocalStorage.setItem('empresasList', JSON.stringify(empresasList));
          if (this.sesionService.getEmpresa() == null) {
            this.sesionService.setEmpresa(empresasList[0]);
          }
          let finPermisos = false;
          let finConfig = false;
          this.cargarPermisos()
            .then(() => {
              finPermisos = true;
              if (finPermisos == true && finConfig == true)
                resolve();
            });
          this.cargarConfiguracion()
            .then(() => {
              finConfig = true;
              if (finPermisos == true && finConfig == true)
                resolve();
            });
        }
      );
    });
  }

  cargarPermisos() {
    return this.permisoService.findAll().then(
      data => {
        let mapaPermisos = {};
        (<any[]>data).forEach(element => mapaPermisos[element.recurso.codigo] = { 'valido': element.valido, 'areas': element.areas });
        this.sesionService.setPermisosMap(mapaPermisos);
      }
    );
  }

  cargarConfiguracion() {
    return this.configService.obtenerPorEmpresa()
      .then(resp => {
        let listConf = <ConfiguracionGeneral[]>resp;
        let mapaConfig = {};
        listConf.forEach(conf => {
          mapaConfig[conf.codigo] = { 'valor': conf.valor, 'nombre': conf.nombre };
        });
        this.sesionService.setConfiguracionMap(mapaConfig);
      });
  }
  private alert;
  async validate(){
    let res;
    try {
     res = await this.authService.checkisLoginExist(this.form.value.email, this.form.value.passwd);
    } catch (error) {
      if(error.status === 400) return res = {exit:"false"};
    }
    console.log(res);
    if(res.exit == "true"){
      console.log("abrir modal");
      let  alert = await this.alertController.create({
        header: "Sesion",
        subHeader: "",
        message: "se perderan los cambios no guardados en sus otras sesiones",
        buttons: [
            {
                text: 'Sí',
                handler: () => {
               
                  this.onSubmit();
                 
                }
            },
            {
                text: 'No',
                handler: () => { 
                  this.alertController.getTop();
                }
            }
        ]

    }); 
   
 await alert.present(); 
    
		}else{
	    this.onSubmit();
    }

    
	}
  onSubmit() {
    let loading = this.showLoading();
    this.authService.login(this.form.value.email, this.form.value.passwd, true, this.form.value.pin)
      .then(res => {
        if (this.sesionService.getUsuario().fechaAceptaTerminos == null) {
          this.authService.getSubjectTerminos().next(true);
        }

        this.consultarEmpresas(res['usuario'].id)
          .then(() => {
            this.visible = false;
            if (this.modal) {
              this.authService.onLogin(res);
              loading.then(loadPop => loadPop.dismiss());
            } else {
              loading.then(loadPop => loadPop.dismiss())
                .then(resp => {
                  this.router.navigate([this.authService.redirectUrl])
                });
            }
          });
      })
      .catch(err =>
        loading.then(loadPop => loadPop.dismiss())
          .then(resp => {
            this.manageError(err);
          })
      );
  }

  manageError(err) {
    if (err['name'] != null && err['name'] == 'TimeoutError') {
      this.msgUsuarioService.showMessage({
        tipoMensaje: 'warn',
        mensaje: 'CONEXIÓN DEFICIENTE',
        detalle: 'La conexión está tardando mucho tiempo en responder, la solicitud ha sido cancelada. Por favor intente mas tarde.'
      });
      return;
    }
    switch (err.status) {
      case 0:
        this.msgUsuarioService.showMessage({
          tipoMensaje: 'warn',
          mensaje: 'ERROR DE CONEXIÓN',
          detalle: 'No se ha podido establecer conexión con el servidor. Por favor verifique que cuenta con conexión a internet.'
        });
        break;
      case 403:
        if (err.error != null && err.error.codigo == 2004) {
            console.log(err);
          this.router.navigateByUrl('/appUpdate');
        } else {
          this.msgUsuarioService.showMessage({
            tipoMensaje: 'warn',
            mensaje: 'CREDENCIALES INCORRECTAS',
            detalle: 'El usuario o contraseña especificada no son correctas'
          });
        }
        break;
      case 401:
        let msg: MensajeUsuario = err.error;
        if (msg.codigo == 2_007) {
          this.visiblePin = true;
        }
        if (msg.codigo == 2_009) {
          this.contadorFallas = this.intentosMax;
        }
        this.msgUsuarioService.showMessage({
          tipoMensaje: msg.tipoMensaje,
          mensaje: msg.mensaje,
          detalle: msg.detalle
        });
        break;
      default:
        this.msgUsuarioService.showMessage({
          tipoMensaje: 'error',
          mensaje: 'ERROR',
          detalle: 'Se ha generado un error no esperado'
        });
        break;
    }
    this.contadorFallas += 1;
    if (this.contadorFallas >= this.intentosMax) {
      this.iniciarContador(new Date().getTime() + (2 * 60 * 1000));
    }
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Por favor espere...',
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  iniciarContador(countDown: number) {
    localStorage.setItem('countDown', '' + countDown);
    let interval = window.setInterval(() => {
      let now = new Date().getTime();
      let distance = countDown - now;
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.relojText = minutes + "m " + seconds + "s ";
      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(interval);
        this.contadorFallas = 0;
        localStorage.removeItem('countDown');
      }
    }, 1000);
  }


  async abrirRecuperarPasswd() {
    const alert = await this.alertController.create({
      message: 'Por favor especifique el correo electrónico de su usuario para reestablecer la contraseña. Será enviado con una clave temporal a su correo.',
      inputs: [
        {
          name: 'email1',
          type: 'text',
          placeholder: 'Correo electrónico'
        },
        {
          name: 'email2',
          type: 'text',
          placeholder: 'Repita Correo electrónico'
        },
      ],
      buttons: [
        {
          text: 'Reestablecer',
          handler: data => {
            if (data.email1 == null || data.email1 == '' || data.email2 == null || data.email2 == '') {
              this.msgUsuarioService.showMessage({ mensaje: 'CAMPOS REQUERIDOS', detalle: 'Los campos correo electrónico son requeridos', tipoMensaje: 'warn' });
              return false;
            }
            if (data.email1 != data.email2) {
              this.msgUsuarioService.showMessage({ mensaje: 'CORREOS REQUERIDOS', detalle: 'Debe especificar el mismo correo de usuario en los campos', tipoMensaje: 'warn' });
              return false;
            }
            this.visibleLnkResetPasswd = false;
            this.authService.resetPassword(data.email1)
              .then(resp => {
                this.msgUsuarioService.showMessage(resp);
                this.visibleLnkResetPasswd = true;
              })
              .catch(err => {
                this.visibleLnkResetPasswd = true;
                this.manageError(err);
              });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
  }

  togglePasswd() {
    this.passwdVisible = !this.passwdVisible;
  }

  actualizar() {
    let so = localStorage.getItem('plataforma');
    if (so == 'android') {
      this.market.open('co.sigess.app');
    } else if (so == 'ios') {
      this.market.open('1562431304');
    } else {
      alert("Plataforma no detectada");
    }

  }

}
