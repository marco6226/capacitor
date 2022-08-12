import { ModalController } from '@ionic/angular';
import { Observacion } from './../../entities/observacion';
import { OfflineService } from './../../../com/services/offline.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ObservacionConsultarFormComponent } from '../observacion-consultar-form/observacion-consultar-form.component';
import { SesionService } from '../../../com/services/sesion.service';


@Component({
  selector: 'app-observacion-consultar',
  templateUrl: './observacion-consultar.component.html',
  styleUrls: ['./observacion-consultar.component.scss'],
})
export class ObservacionConsultarComponent implements OnInit {
  @Output("onObservacionSelect") onObservacionSelect = new EventEmitter<Observacion>();

  observacionLista: Observacion[];
  loading: boolean;
  observacionList: any;
  areasPermiso: string;
  
  constructor(
    private offlineService: OfflineService,
    public modalController: ModalController,
    private sesionService: SesionService,
  ) { }

  ngOnInit() {
    this.areasPermiso = this.sesionService.getPermisosMap()['AUC_GET_OBS'].areas;
    this.cargarObservaciones();
  }
    
  cargarObservaciones() {
    this.loading = true;
    this.offlineService.queryObservacion()
      .then(resp => {
        this.observacionLista = resp['data'];
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  convertirAFecha(timestamp: number){
    var date = new Date(timestamp);
    return date.toLocaleString();
    return (date.getDate()+
    "/"+(date.getMonth()+1)+
    "/"+date.getFullYear());
  }

  async onConsultaSelect(observacion: Observacion){
    const modal = await this.modalController.create({
      component: ObservacionConsultarFormComponent,
      componentProps: { value: observacion, operacion:"GET" },
      cssClass: "modal-fullscreen"
    });
    modal.onDidDismiss().then(
      resp => this.onModalDismiss(resp.data)
    );
    return await modal.present();
  }

  onModalDismiss(obser: Observacion) {
    if (obser != null && obser.id == null) {
      //this.obsCount += 1;
      //this.obserSyncComp.adicionarObservacion(obser);
    }
  }

}
