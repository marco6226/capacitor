import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observacion } from '../../entities/observacion';
// import { asyncLocalStorage, Util } from '../../../com/utils/util';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { AlertController } from '@ionic/angular';
import { ObservacionService } from '../../services/observacion.service';
import { StorageService } from '../../../com/services/storage.service';
import { Util } from '../../../com/utils/util';

@Component({
  selector: 'sm-observacionSync',
  templateUrl: './observacion-sync.component.html',
  styleUrls: ['./observacion-sync.component.scss'],
  providers: [ObservacionService]
})
export class ObservacionSyncComponent implements OnInit {

  obserList: Observacion[];
  @Output('onEvent') onEvent = new EventEmitter<any>();


  constructor(
    public storageService: StorageService,
    public msgService: MensajeUsuarioService,
    public dirService: DirectorioService,
    public alertController: AlertController,
    public obserService: ObservacionService
  ) {

  }

  ngOnInit() {
    this.storageService.getSyncObservaciones()
      .then((resp: any) => {
        this.onEvent.emit({ type: 'onLoad', count: resp.count });
        this.obserList = resp.data;
      });
  }

  adicionarObservacion(obser: Observacion): any {
    if (this.obserList == null)
      this.obserList = [];
    this.obserList.push(obser);
    this.obserList = this.obserList.slice();
  }

  borrarObservacion(observ: Observacion, indice: number, emitEvent?: boolean) {
    this.storageService.borrarSyncObservacion(observ);    
    this.obserList.splice(indice, 1);
    this.obserList = this.obserList.slice();
    if (emitEvent)
      this.onEvent.emit({ type: 'onLocalRemove', count: this.obserList.length, inspeccion: observ });
  }

  async presentAlertConfirm(obser: Observacion, index: number) {
    const alert = await this.alertController.create({
      header: '¿Eliminar observación?',
      message: 'Esto borrará de su entorno local la observación y no podrá sincronizarla. ¿Confirma esta acción?',
      buttons: [{
        text: 'Si',
        handler: () => {
          this.borrarObservacion(obser, index, true);
          this.msgService.showMessage({ tipoMensaje: 'info', mensaje: 'Observación eliminada de entorno local', detalle: '' });
        }
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'No'
      }]
    });
    await alert.present();
  }

  sincronizar(obser: Observacion, indice: number) {
    obser['sync'] = true;
    this.obserService.create(obser)
      .then(obsResp => {
        if (obser['imagenes'] != null) {
          for (let i = 0; i < obser['imagenes'].length; i++) {
            let img = obser['imagenes'][i];
            if (img != null)
              Util.dataURLtoFile(img, 'img_' + i + '_obs_' + obsResp['id'] + '.jpeg').then(file =>
                this.dirService.upload(file, null, 'AUC', obsResp['id'])
              );
          }
        }

        this.borrarObservacion(obser, indice);
        obser['sync'] = false;

        this.msgService.showMessage({
          tipoMensaje: 'success',
          mensaje: 'Observación sincronizada',
          detalle: 'La observación ha sido sincronizada correctamente'
        });
        this.onEvent.emit({ type: 'onSync', observacion: obsResp, count: this.obserList.length });
      })
      .catch(err => {
        obser['sync'] = false;
      });
  }
}
