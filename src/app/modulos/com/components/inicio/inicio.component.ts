import { Component, OnInit } from '@angular/core';

import { SesionService } from './../../services/sesion.service'
import { Router } from '@angular/router';
import { EmpresaService } from '../../../emp/services/empresa.service';
import { Empresa } from '../../../emp/entities/empresa';
import { AuthService } from '../../services/auth.service';
import { PermisoService } from '../../../emp/services/permiso.service';
import { Permiso } from '../../../emp/entities/permiso';
import { OfflineService } from '../../services/offline.service';
import { MensajeUsuarioService } from '../../services/mensaje-usuario.service';
import { MensajeUsuario } from '../../entities/mensaje-usuario';
import { LoadingController, AlertController } from '@ionic/angular';
import { asyncLocalStorage } from '../../utils/util';
import { Usuario } from '../../../emp/entities/usuario';
import { ConfiguracionGeneralService } from '../../services/configuracion-general.service';
import { ConfiguracionGeneral } from '../../entities/configuracion-general';

@Component({
  selector: 'sm-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  providers: [EmpresaService, PermisoService]
})
export class InicioComponent implements OnInit {

  nombreInp: string
  nombreAuc: string
  nombreCop: string
  nombreSec: string
  nombreInd: string

  empresasList: Empresa[];
  empresaSelect: Empresa;
  offline = false;
  mapaPermisos: any;
  usuario: Usuario;

  constructor(
    private configService: ConfiguracionGeneralService,
    private router: Router,
    private authService: AuthService,
    private sesionService: SesionService,
    private empresaService: EmpresaService,
    private permisoService: PermisoService,
    private offlineService: OfflineService,
    private msgService: MensajeUsuarioService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {

  }

  ngOnInit() {
    this.usuario = this.sesionService.getUsuario();
    this.offline = this.sesionService.getOfflineMode();
    this.empresasList = JSON.parse(localStorage.getItem('empresasList'));
    this.empresaSelect = this.sesionService.getEmpresa();

    this.nombreInp = this.sesionService.getConfigParam('NOMB_MOD_INP');
    this.nombreAuc = this.sesionService.getConfigParam('NOMB_MOD_AUC');
    this.nombreCop = this.sesionService.getConfigParam('NOMB_MOD_COP');
    this.nombreSec = this.sesionService.getConfigParam('NOMB_MOD_SEC');
    this.nombreInd = this.sesionService.getConfigParam('NOMB_MOD_IND');
  }

  cargarPermisos() {
    return this.permisoService.findAll().then(
      data => {
        this.mapaPermisos = {};
        (<Permiso[]>data).forEach(element => this.mapaPermisos[element.recurso.codigo] = { 'valido': element.valido, 'areas': element.areas });
        this.sesionService.setPermisosMap(this.mapaPermisos);
      }
    );
  }
  cargarConfiguracion() {
    return this.configService.obtenerPorEmpresa()
      .then((resp: ConfiguracionGeneral[]) => {
        let mapaConfig = {};
        resp.forEach(conf => {
          mapaConfig[conf.codigo] = { 'valor': conf.valor, 'nombre': conf.nombre };
        });
        this.sesionService.setConfiguracionMap(mapaConfig);
      });
  }

  cambiarEmpresa(event) {
    this.offline = true;
    this.offlineToggle()
      .then(() => {
        this.empresaSelect = event.detail.value;
        this.sesionService.setEmpresa(this.empresaSelect);
        this.cargarPermisos()
          .then(() => {
            this.cargarConfiguracion()
              .then(() => {
                location.reload();
              })
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  logout() {
    let loading = this.showLoading('Cerrando sesión...');
    this.authService.logout()
      .then(resp => {
        loading.then(loadPop => loadPop.dismiss());
        try {
          // if (navigator['app'] == null)
            this.router.navigate(['/login']).then(() => location.reload());
          // else
          //   navigator['app'].exitApp();
        } catch (error) {
          console.log(error);
        }
      })
      .catch(err => {
        loading.then(loadPop => loadPop.dismiss());
        if (err.name != null && err.name == 'TimeoutError') {
          this.msgService.showMessage({
            tipoMensaje: 'warn',
            mensaje: 'CONEXIÓN DEFICIENTE',
            detalle: 'La conexión está tardando mucho tiempo en responder, la solicitud ha sido cancelada. Por favor intente mas tarde.'
          });
          return;
        }
        switch (err.status) {
          case 0:
            this.msgService.showMessage({
              tipoMensaje: 'warn', mensaje: 'ERROR DE CONEXIÓN',
              detalle: 'Se debe contar con conexión a internet para salir de manera segura.'
            });
            break;
          default:
            this.msgService.showMessage({ tipoMensaje: 'error', mensaje: 'ERROR', detalle: 'Se ha generado un error no esperado' });
            break;
        }
      });
  }
  async logOutConfirm() {
    const alert = await this.alertController.create({
      header: '¿Salir de la aplicación?',
      message: 'Si tiene datos para sincronizar podría perderlos, se recomienda sincronizarlos previamente. ¿Desea continuar?',
      buttons: [{
        text: 'Si',
        handler: () => this.logout()
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'No'
      }]
    });
    await alert.present();
  }

  offlineToggle() {
    return new Promise<void>((resolve, reject) => {
      this.offline = !this.offline;
      if (this.offline) {
        let loading = this.showLoading('Cargando datos...');
        this.offlineService.loadData().then(
          resp => {
            loading.then(loadPop => loadPop.dismiss()).then(res =>
              this.msgService.showMessage({
                tipoMensaje: 'info', mensaje: 'Modo offline activado', detalle: ''
              }));
            this.offline = true;
            this.offlineService.setOfflineMode(true);
            resolve();
          },
          err => {
            loading.then(loadPop => loadPop.dismiss());
            this.offline = false;
            this.offlineService.setOfflineMode(false);
            reject();
          }
        );
      } else {
        let loading = this.showLoading('Activando modo online...');
        this.offlineService.sincronizar().then(
          resp => loading
            .then(loadPop => loadPop.dismiss())
            .then(res => this.msgService.showMessage(<MensajeUsuario>resp))
            .then(() => resolve())
          ,
          err => {
            loading.then(loadPop => loadPop.dismiss());
            this.offline = false;
            this.offlineService.setOfflineMode(false);
            reject();
          }
        );
      }
    });
  }

  async showLoading(msg: string) {
    const loading = await this.loadingController.create({
      message: msg,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  navegar(url) {
    this.router.navigate([url])
  }

}

