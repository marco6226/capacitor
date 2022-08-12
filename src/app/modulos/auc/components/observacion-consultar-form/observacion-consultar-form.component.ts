import { AuthService } from './../../../com/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DirectorioService } from './../../../ado/services/directorio.service';
//import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { ObservacionService } from './../../services/observacion.service';
import { OfflineService } from './../../../com/services/offline.service';
import { ModalController, AlertController } from '@ionic/angular';
import { Observacion } from '../../entities/observacion';
import { url } from 'inspector';
import { Criteria, Filter } from '../../../com/entities/filter';
import { FilterQuery } from '../../../com/entities/filter-query';
import { Tarjeta } from '../../entities/tarjeta';
import { ObservacionFormComponent } from '../observacion-form/observacion-form.component';
import { ObservacionSyncComponent } from '../observaciones-sync/observacion-sync.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService } from '../../../com/services/sesion.service';
import { ObservacionEditarComponent } from '../observacion-editar/observacion-editar.component';

@Component({
  selector: 'app-observacion-consultar-form',
  templateUrl: './observacion-consultar-form.component.html',
  styleUrls: ['./observacion-consultar-form.component.scss'],
})
export class ObservacionConsultarFormComponent implements OnInit {

  @ViewChild('obserSyncComp') obserSyncComp: ObservacionSyncComponent;

  observacionLista: Observacion;
  consultar: boolean;
  observacion: Observacion;
  listado: boolean=true;
  CambioObs: boolean=true;
  imagenesList: any = [];
  isGestionar: boolean=false;
  motivo: string;
  msg: string;
  tarjeta: Tarjeta;
  obsCount = 0;
  idEmpresa: string;

  constructor(
    
    private alertController: AlertController,
    private modalController: ModalController,
    private offlineService: OfflineService,
    private observacionService: ObservacionService,
    private directorioService: DirectorioService,
    private domSanitizer: DomSanitizer,
    public sesionService: SesionService,
    private authService: AuthService
  ) { }

  async ngOnInit() { 

    this.idEmpresa = this.sesionService.getEmpresa().id;

    await this.leerObservacionSeleccionada();

    await this.cargaDatosLista();  

    setTimeout(() => {
      this.motivo = this.observacion.motivo;
    }, 200);
    
  }

  async leerObservacionSeleccionada(){
    await this.modalController.getTop()
    .then(data => {
      this.consultar = (<any>data).componentProps.operacion == 'GET';
      if (this.consultar == true) {
        this.observacion = (<any>data).componentProps.value;
      }      
    }); 
  }

  anterior() {
    this.presentAlertaSalir();
  }

  async presentAlertaSalir() {
    const alert = await this.alertController.create({
      header: '¿Desea salir?',
      message: 'La observación no ha sido guardada, los datos serán descartados. ¿Confirma esta acción?',
      buttons: [{
        text: 'Si',
        handler: () => {
          this.modalController.dismiss();
        }
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'No'
      }]
    });
    await alert.present();
  }
  cargarObservacion(){
    
      this.offlineService.queryObservacion()
      .then(resp => {
        this.observacionLista = resp['data'];
      })
  }

  cargaDatosLista(){
    //this.loading = true;this.observacion.id.toString()
    if(Number.parseInt(this.observacion.id) > 0){
      this.offlineService.queryObservacionSelectID(this.observacion.id)
        .then(resp => {
          this.observacionLista = resp['data'];
        })
    }  

    let filter = new Filter();
        filter.criteria = Criteria.EQUALS;
        filter.field = "id";
        filter.value1 = this.observacion.id;
        let filterQuery = new FilterQuery();
        filterQuery.filterList = [filter];

    this.observacionService
      .findByFilter(filterQuery)
      .then((resp) => (this.observacion = resp["data"][0]))
      .then((resp) => {
          this.observacion.documentoList.forEach((doc) => {
              this.directorioService.download(doc.id).then((data) => {
                  let urlData = this.domSanitizer.bypassSecurityTrustUrl(
                      URL.createObjectURL(<any>data)
                  );
                  this.imagenesList.push({ source: Object.values(urlData) });
                  this.imagenesList = this.imagenesList.slice();
              });
          });
      });      
  }

  convertirAFecha(timestamp: number){
    var date = new Date(timestamp);
    return date.toLocaleString();
  }

  
  async FinishReturn(){
    console.log(this.msg)
    const alert = await this.alertController.create({
      header: 'Datos Almacenados',
      message: this.msg,
      buttons: [{
        text: 'Si',
        handler: () => {
          this.modalController.dismiss();
        }
      },]
    });
    await alert.present();
  }

  async guardarGestionObervacion(tipoEstado: string){

    if(this.motivo != null && this.motivo != ""){
      
      console.log(tipoEstado)
      this.observacion.motivo = this.motivo;
      console.log(this.observacion)
      this.observacionService
          .guardarGestionObervacion(this.observacion, tipoEstado)
          .then((data) => {
            if(tipoEstado=='aceptar'){
              this.msg = "La observación ha sido aceptada correctamente"; 
            }
            else{
              this.msg = "La observación ha sido denegada correctamente"; 
            }            
            this.FinishReturn();
          });
          if(tipoEstado == 'denegar') {     
            this.authService.sendNotificationObservacionDenegada(
              this.observacion.usuarioReporta.email,
              this.observacion
            );
          }
    }
    else{
      const alert = await this.alertController.create({
        header: 'la Observación no puede estar vacia',
        message: this.msg,
        buttons: [{
          text: 'ok',
        },]
      });
      await alert.present();
    }
  }
  
  async onTarjetaEdit() {
    this.tarjeta = this.observacionLista[0].tarjeta;
    console.log(this.observacionLista)
    const modal = await this.modalController.create({
      component: ObservacionEditarComponent,
      componentProps: { tarjeta: this.tarjeta, operacion:"GET", observacion: this.observacion },
      cssClass: 'NoSE'
    });
    modal.onDidDismiss().then(
      resp => this.onModalDismiss(resp.data)
    );
    return await modal.present();
  }
  
  async onTarjetaSelect() {
    this.tarjeta = this.observacionLista[0].tarjeta;
    console.log(this.observacionLista)
    const modal = await this.modalController.create({
      component: ObservacionFormComponent,
      componentProps: { value: this.tarjeta, operacion:"GET", value1: this.observacion },
      cssClass: 'modal-fullscreen'
    });
    modal.lastChild
    modal.onDidDismiss().then(
      resp => this.onModalDismiss(resp.data)
    );
    return await modal.present();
  }

  onModalDismiss(obser: Observacion) {
    if (obser != null && obser.id == null) {
      this.obsCount += 1;
      this.obserSyncComp.adicionarObservacion(obser);
    }
  }

  checarTipoObservacion( datos, label): boolean {
    return datos === label;
}


}
