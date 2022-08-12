import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OfflineService } from '../../../com/services/offline.service';
import { Observacion } from '../../entities/observacion';
import { Tarjeta } from '../../entities/tarjeta';
import { ObservacionFormComponent } from '../observacion-form/observacion-form.component';
import { ObservacionSyncComponent } from '../observaciones-sync/observacion-sync.component';

@Component({
  selector: 'app-observacion-tarjetas',
  templateUrl: './observacion-tarjetas.component.html',
  styleUrls: ['./observacion-tarjetas.component.scss'],
})
export class ObservacionTarjetasComponent implements OnInit {

  @ViewChild('obserSyncComp') obserSyncComp: ObservacionSyncComponent;
  tarjetaList: Tarjeta[];
  obsCount = 0;
  loading: boolean;
  tarjetasCargadas: boolean;

  constructor(
    private offlineService: OfflineService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.cargarTarjetas();
  }
  
  cargarTarjetas() {
    this.loading = true;
    this.tarjetasCargadas = null;
    this.offlineService.queryTarjetaObservacion()
      .then(resp => {
        this.tarjetaList = <Tarjeta[]>resp;
        this.loading = false;
        this.tarjetasCargadas = true;
      })
      .catch(err => {
        this.loading = false;
        this.tarjetasCargadas = false;
      });
  }

  async onTarjetaSelect(tarjeta: Tarjeta) {
    const modal = await this.modalController.create({
      component: ObservacionFormComponent,
      componentProps: { value: tarjeta },
      cssClass: "modal-fullscreen"
    });
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
}
