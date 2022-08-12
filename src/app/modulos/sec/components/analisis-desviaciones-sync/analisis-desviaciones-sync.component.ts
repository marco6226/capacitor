import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AnalisisDesviacion } from '../../entities/analisis-desviacion';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { AlertController } from '@ionic/angular';
import { AnalisisDesviacionService } from '../../services/analisis-desviacion.service';
import { Documento } from '../../../ado/entities/documento';
import { StorageService } from '../../../com/services/storage.service';
import { Util } from '../../../com/utils/util';

@Component({
  selector: 'sm-analisisDesviacionesSync',
  templateUrl: './analisis-desviaciones-sync.component.html',
  styleUrls: ['./analisis-desviaciones-sync.component.scss'],
  providers: [AnalisisDesviacionService]
})
export class AnalisisDesviacionesSyncComponent implements OnInit {

  analisisDesvList: AnalisisDesviacion[];
  @Output('onEvent') onEvent = new EventEmitter<any>();


  constructor(
    private storageService: StorageService,
    private msgService: MensajeUsuarioService,
    private dirService: DirectorioService,
    public alertController: AlertController,
    private anDesvService: AnalisisDesviacionService
  ) {

  }

  ngOnInit() {
    this.storageService.getAnalisisListSync()
      .then(resp => {
        if (resp != null) {
          this.onEvent.emit({ type: 'onLoad', count: resp.count, analisisList: resp.data });
          this.analisisDesvList = resp.data;
        } else {
          this.onEvent.emit({ type: 'onLoad', count: 0, analisisList: [] });
        }
      });
  }

  adicionarAnalisis(analisis: AnalisisDesviacion): any {
    if (this.analisisDesvList == null)
      this.analisisDesvList = [];
    this.analisisDesvList.push(analisis);
    this.analisisDesvList = this.analisisDesvList.slice();
  }

  borrarAnalisis(analisis: AnalisisDesviacion, indice: number, emitEvent?: boolean) {
    this.storageService.borrarAnalisis(analisis['hash']);
    this.analisisDesvList.splice(indice, 1);
    this.analisisDesvList = this.analisisDesvList.slice();

    if (emitEvent)
      this.onEvent.emit({ type: 'onLocalRemove', count: this.analisisDesvList.length, analisis: analisis });
  }



  async presentAlertConfirm(analisis: AnalisisDesviacion, index: number) {
    const alert = await this.alertController.create({
      header: '¿Eliminar investigación?',
      message: 'Esto borrará de su entorno local la investigación y no podrá sincronizarla. ¿Confirma esta acción?',
      buttons: [{
        text: 'Si',
        handler: () => {
          this.borrarAnalisis(analisis, index, true);
          this.msgService.showMessage({ tipoMensaje: 'info', mensaje: 'Investigación eliminada de entorno local', detalle: '' });
        }
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'No'
      }]
    });
    await alert.present();
  }

  manejarRespuestaSync(analisis, idx, resp) {
    this.msgService.showMessage({
      tipoMensaje: 'success',
      mensaje: 'Investigación sincronizada',
      detalle: 'La investigacion ha sido sincronizada correctamente'
    });
    this.borrarAnalisis(analisis, idx);
    this.onEvent.emit({ type: 'onSync', analisis: resp, count: this.analisisDesvList.length });
  }

  sincronizar(analisis: AnalisisDesviacion, indice: number) {
    analisis['sync'] = true;
    let documentosList = analisis['imagenes'];
    let documentosEliminarList = analisis['imagenes_eliminar'];

    if (analisis.id == null) {
      this.anDesvService.create(analisis)
        .then((resp: AnalisisDesviacion) => {
          analisis.id = (<AnalisisDesviacion>resp).id;
          if (documentosList != null) {
            documentosList.forEach(doc => {
              Util.dataURLtoFile(doc.url, doc.alias + '.' + doc.ext)
                .then(file => {
                  let docMetadata = new Documento();
                  docMetadata.descripcion = doc.descripcion;
                  this.dirService.subirArchAnalisis(file, analisis.id, docMetadata);
                });
            });
          }
          this.storageService.guardarAnalisisDesviacion(resp);
          this.manejarRespuestaSync(analisis, indice, resp);
        })
        .catch(err => {
          analisis['sync'] = false;
        });
    } else {
      this.anDesvService.update(analisis)
        .then((resp:AnalisisDesviacion) => {
          // Actualiza o crea los documentos del analisis de desviacion realizado
          if (documentosList != null) {
            documentosList.forEach(arch => {
              if (arch.documentoId == null) {
                Util.dataURLtoFile(arch.url, arch.alias + '.' + arch.ext)
                  .then(file => {
                    let docMetadata = new Documento();
                    docMetadata.descripcion = arch.descripcion;
                    this.dirService.subirArchAnalisis(file, analisis.id, docMetadata);
                  });
              } else {
                let docUpdate = new Documento();
                docUpdate.id = arch.documentoId;
                docUpdate.nombre = arch.alias + '.' + arch.ext;
                docUpdate.descripcion = arch.descripcion;
                this.dirService.actualizarArchAnalisis(docUpdate);
              }
            });
          }
          // Solicita eliminar los documentos marcados para eliminacion permanente.
          if (documentosEliminarList != null) {
            documentosEliminarList.forEach(arch => {
              this.dirService.eliminarArchAnalisis(arch.documentoId);
            });
          }
          this.storageService.guardarAnalisisDesviacion(resp);
          this.manejarRespuestaSync(analisis, indice, resp);
        })
        .catch(err => {
          analisis['sync'] = false;
        });
    }
  }
}
