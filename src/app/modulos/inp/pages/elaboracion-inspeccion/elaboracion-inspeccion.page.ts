import { ListaInspeccionService } from './../../services/lista-inspeccion.service';
import { ListaInspeccionPK } from './../../entities/lista-inspeccion-pk';
import { Component, OnInit, ViewChild } from '@angular/core';
import { InspeccionFormComponent } from '../../components/inspeccion-form/inspeccion-form.component';
import { ModalController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Programacion } from '../../entities/programacion';
import { Inspeccion } from '../../entities/inspeccion';
import { asyncLocalStorage } from '../../../com/utils/util';
import { InspeccionesSyncComponent } from '../../components/inspecciones-sync/inspecciones-sync.component';
import { ProgramacionInspeccionesComponent } from '../../components/programacion-inspecciones/programacion-inspecciones.component';
import { StorageService } from '../../../com/services/storage.service';
import { InspeccionPendienteComponent } from '../../components/inspeccion-pendiente/inspeccion-pendiente.component';
import { ListaInspeccion } from '../../entities/lista-inspeccion';

import { OfflineService } from '../../../com/services/offline.service';
import { Criteria } from '../../../com/entities/filter';
import { FilterQuery } from '../../../com/entities/filter-query';
import { InspeccionNoProgramadaComponent } from '../../components/inspeccion-no-programada/inspeccion-no-programada.component';
import { InspeccionesRealizadasComponent } from '../../components/inspecciones-realizadas/inspecciones-realizadas.component';
import { callInstance } from '@ionic-native/core/decorators/common';

@Component({
    selector: 'sm-elaboracionInspeccion',
    templateUrl: './elaboracion-inspeccion.page.html',
    styleUrls: ['./elaboracion-inspeccion.page.scss'],
})
export class ElaboracionInspeccionPage implements OnInit {
    @ViewChild('inspSyncComp') inspSyncComp: InspeccionesSyncComponent;
    @ViewChild('inspRealizadas') inspRealizadas: InspeccionesSyncComponent;
    @ViewChild('progInspComp') progInspComp: ProgramacionInspeccionesComponent;

    filtDisp: boolean;

    segments = { listas: true, prog: false, realizadas: false, noProgramadas:false, insp: false };
    inspCount = 0;
    inspCargadas: boolean = false;

    count = 0;
    loading = true;
    disabled = false;
    inspeccionList: ListaInspeccion[];
    inspListSelect: ListaInspeccion[];
    inspList: Inspeccion[];

    constructor(
        public popoverController: PopoverController,
        public storageService: StorageService,
        public modalController: ModalController,
        private offlineService: OfflineService,
        private router: Router
    ) {}

    ngOnInit() {
        this.filtDisp = this.offlineService.getOfflineMode() != true;
    }

    cargarInspPendientes(desdeBoton?: boolean) {
        this.storageService.getInspeccionesPendientes().then((resp) => {
            let inspPend = resp.data;
            console.log(resp.count);
            if (inspPend.length > 0 || desdeBoton == true) {
                this.abrirInspPendientes(inspPend);
            }
        });
    }

    async abrirInspPendientes(inspecciones: Inspeccion[]) {
        const popOver = await this.popoverController.create({
            component: InspeccionPendienteComponent,
            componentProps: { inspecciones: inspecciones },
        });

        popOver.onDidDismiss().then((resp) => {
            let insp: Inspeccion = resp.data;
            if (insp) {
                this.abrirInspeccion(null, null, insp);
            }
        });
        console.log(Inspeccion);
        return await popOver.present();
    }

    async abrirInspeccion(programacion: Programacion, listaInspeccion: ListaInspeccion, inspeccion: Inspeccion) {
        const modal = await this.modalController.create({
            component: InspeccionFormComponent,
            componentProps: {
                programacion: programacion,
                listaInspeccion: listaInspeccion,
                inspeccion: inspeccion,
            },

            cssClass: 'modal-fullscreen',
        });
        modal.onDidDismiss().then((resp) => {
            this.onModalDismiss(resp['data'], programacion != null ? programacion : null);
        });
        return await modal.present();
    }

    onModalDismiss(inspeccion: Inspeccion, prog: Programacion) {
        if (inspeccion != null && inspeccion.id == null) {
            this.inspSyncComp.adicionarInspeccion(inspeccion);
            this.inspCount += 1;
        } else if (inspeccion != null && prog != null) {
            prog.numeroRealizadas += 1;
        }
    }

    onEvent(event) {
        switch (event.type) {
            case 'onSync':
                // si event.inspeccion.programacion  == null indica que es una programacion no programada

                if (event.inspeccion.programacion != null) this.progInspComp.actualizarProgMetadata(event.inspeccion.programacion.id, true, false);
                break;
            case 'onLocalRemove':
                // si event.inspeccion.programacion  == null indica que es una programacion no programada

                if (event.inspeccion.programacion != null) this.progInspComp.actualizarProgMetadata(event.inspeccion.programacion.id, null, false);
                break;
        }
        this.inspCount = event.count;
    }

    navegar(url) {
        this.router.navigate([url]);
    }

    segmentChanged(event) {
        for (var seg in this.segments) {
            this.segments[seg] = false;
            if (event.detail.value == seg) this.segments[seg] = true;
        }
    }

    /* *********************** inspecciones no programadas ******************************** */
}
