import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { Inspeccion } from '../../entities/inspeccion';
import { Util } from '../../../com/utils/util';
import { InspeccionService } from '../../services/inspeccion.service';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../../../com/services/storage.service';
import { OfflineService } from '../../../com/services/offline.service';

@Component({
    selector: 'sm-inspeccionesSync',
    templateUrl: './inspecciones-sync.component.html',
    styleUrls: ['./inspecciones-sync.component.scss'],
})
export class InspeccionesSyncComponent implements OnInit {
    @Input('inspecciones') inspList: Inspeccion[];
    @Output('onEvent') onEvent = new EventEmitter<any>();

    // @Output('onLoadEvent') onLoadEvent = new EventEmitter<any>();

    constructor(
        private storageService: StorageService,
        private inspeccionService: InspeccionService,
        private msgService: MensajeUsuarioService,
        private dirService: DirectorioService,
        public alertController: AlertController,
        public offlineService: OfflineService
    ) {}

    ngOnInit() {
        this.offlineService.queryInspeccionesRealizadas().then();
    }

    adicionarInspeccion(inspeccion: Inspeccion) {
        if (this.inspList == null) this.inspList = [];
        this.inspList.push(inspeccion);
        this.inspList = this.inspList.slice();
    }

    adicionarInspeccionRealizada(inspeccion: Inspeccion) {
        if (this.inspList == null) this.inspList = [];
        if (this.inspList[0].fechaRealizada != null) this.inspList.push(inspeccion);
        this.inspList = this.inspList.slice();
    }

    borrarInspeccion(insp: Inspeccion, indice: number, emitEvent?: boolean) {
        return this.storageService.borrarInspeccion(insp).then(() => {
            this.inspList.splice(indice, 1);
            this.inspList = this.inspList.slice();
            if (emitEvent)
                this.onEvent.emit({
                    type: 'onLocalRemove',
                    count: this.inspList.length,
                    inspeccion: insp,
                });
        });
    }

    async presentAlertConfirm(inp: Inspeccion, index: number) {
        const alert = await this.alertController.create({
            header: '¿Eliminar inspección?',
            message: 'Esto borrará de su entorno local la inspección y no podrá sincronizarla. ¿Confirma esta acción?',
            buttons: [
                {
                    text: 'Si',
                    handler: () => {
                        this.borrarInspeccion(inp, index, true);
                        this.msgService.showMessage({
                            tipoMensaje: 'info',
                            mensaje: 'Inspección eliminada de entorno local',
                            detalle: '',
                        });
                    },
                },
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'No',
                },
            ],
        });
        await alert.present();
    }

    sincronizar(insp: Inspeccion, indice: number) {
        insp['sync'] = true;
        this.inspeccionService
            .create(insp)
            .then((resp) => {
                for (let i = 0; i < insp.calificacionList.length; i++) {
                    let calf = (<Inspeccion>resp).calificacionList[i];
                    let imgsUrls = insp.calificacionList[i]['img_key'];
                    if (imgsUrls != null) {
                        let j = 0;
                        imgsUrls.forEach((url) => {
                            // let url = localStorage.getItem(key);
                            if (url != null) {
                                Util.dataURLtoFile(url, 'img_' + i + j + '_inp_calf_' + calf.id + '.jpeg').then((file) =>
                                    this.dirService.upload(file, null, 'INP', calf.id).then((imgResp) => localStorage.removeItem(url))
                                );
                            }
                            j += 1;
                        });
                    }
                }

                console.log('Sincronizando insp...');
                this.borrarInspeccion(insp, indice).then(() => {
                    insp['sync'] = false;
                    this.msgService.showMessage({
                        tipoMensaje: 'success',
                        mensaje: 'Inspección sincronizada',
                        detalle: 'La inspección ha sido sincronizada correctamente',
                    });
                    this.onEvent.emit({
                        type: 'onSync',
                        inspeccion: resp,
                        count: this.inspList.length,
                    });
                });
            })
            .catch((err) => {
                insp['sync'] = false;
            });
    }
}
