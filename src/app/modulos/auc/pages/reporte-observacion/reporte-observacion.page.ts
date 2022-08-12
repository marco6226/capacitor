import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Tarjeta } from '../../entities/tarjeta';
import { ObservacionFormComponent } from '../../components/observacion-form/observacion-form.component'
import { Router } from '@angular/router';
import { OfflineService } from '../../../com/services/offline.service';
import { Observacion } from '../../entities/observacion';
import { ObservacionSyncComponent } from '../../components/observaciones-sync/observacion-sync.component';
import { SesionService } from '../../../com/services/sesion.service';

@Component({
  selector: 'sm-reporteObservacion',
  templateUrl: './reporte-observacion.page.html',
  styleUrls: ['./reporte-observacion.page.scss']
})
export class ReporteObservacionPage implements OnInit {

  @ViewChild('obserSyncComp') obserSyncComp: ObservacionSyncComponent;
  nombreAuc: string;
  tarjetaList: Tarjeta[];
  segments = { 'tarjeta': true, 'consultar':false, 'observ': false };
  obsCount = 0;
  loading: boolean;
  tarjetasCargadas: boolean;

  constructor(
    private sesionService: SesionService,
    private offlineService: OfflineService,
    public modalController: ModalController,
    public router: Router
  ) { }

  ngOnInit() {
    this.nombreAuc = this.sesionService.getConfigParam('NOMB_MOD_AUC');
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
  onEvent(event) {
    this.obsCount = event.count;
  }

  navegar(url) {
    this.router.navigate([url])
  }

  segmentChanged(event) {
    for (var seg in this.segments) {
      this.segments[seg] = false;
      if (event.detail.value == seg)
        this.segments[seg] = true;

    }
  }
}
