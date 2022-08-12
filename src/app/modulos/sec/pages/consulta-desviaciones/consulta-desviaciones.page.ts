import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OfflineService } from '../../../com/services/offline.service';
import { Desviacion } from '../../entities/desviacion';
import { FilterQuery } from '../../../com/entities/filter-query';
import { ModalController, ToastController } from '@ionic/angular';
import { InvestigacionDesviacionesComponent } from './../../components/investigacion-desviaciones.component.ts/investigacion-desviaciones.component';
import { AnalisisDesviacion } from '../../entities/analisis-desviacion';
import { AnalisisDesviacionesSyncComponent } from '../../components/analisis-desviaciones-sync/analisis-desviaciones-sync.component';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { Criteria } from '../../../com/entities/filter';
import { StorageService } from '../../../com/services/storage.service';
import { AnalisisDesviacionService } from '../../services/analisis-desviacion.service';

@Component({
    selector: 'sm-consultaDesviaciones',
    templateUrl: './consulta-desviaciones.page.html',
    styleUrls: ['./consulta-desviaciones.page.scss'],
    providers: [AnalisisDesviacionService],
})
export class ConsultaDesviacionesPage implements OnInit {
    @ViewChild('analisisDesvSyncComp') analisisDesvSyncComp: AnalisisDesviacionesSyncComponent;

    segments = { desviaciones: true, analisis: false };
    analisisCount = 0;
    count = 0;
    disabled = false;
    desviacionesList: Desviacion[];
    desvListSelect: Desviacion[];
    desviacionesFavList: Desviacion[];

    filtModulo: string;
    filtConcepto: string;
    filtAspecto: string;
    filtCodigo: string;
    filtArea: string;
    //filtJerarquia: string;
    filtInvest: boolean;

    filtDisp: boolean;

    loading = true;

    constructor(
        public analisisService: AnalisisDesviacionService,
        public toastController: ToastController,
        private storageService: StorageService,
        private msgService: MensajeUsuarioService,
        public modalController: ModalController,
        private offlineService: OfflineService,
        private router: Router
    ) {
        this.desviacionesList = [];
    }

    ngOnInit() {
        this.filtDisp = this.offlineService.getOfflineMode() != true;
        this.offlineService.toggleSubject.subscribe((isoffline) => {
            this.filtDisp = !isoffline;
        });
        this.storageService.getDesviacionesFav().then((resp) => (this.desviacionesFavList = resp['data']));
        this.filtrar(false);
    }

    toggleSelect(event, desv: Desviacion, idx: number) {
        desv['selected'] = event.detail.checked;
        if (this.desvListSelect == null) {
            this.desvListSelect = [];
        }
        if (desv['selected']) {
            this.desvListSelect.push(desv);
        } else {
            for (let i = 0; i < this.desvListSelect.length; i++) {
                let element = this.desvListSelect[i];
                if (desv.hashId == element.hashId) {
                    this.desvListSelect.splice(i, 1);
                    break;
                }
            }
        }
    }

    // doRefresh(event) {
    //   console.log(event);
    //   this.inicializar(this.analisisDesvSyncComp.analisisDesvList, event);
    // }

    inicializar(analisisSyncList: AnalisisDesviacion[], refreshEvent?: any) {
        this.offlineService
            .queryDesviaciones()
            .then((resp) => {
                let desvList = <any[]>resp['data'];
                this.desviacionesList = [];

                desvList.forEach((dto) => {
                    // Recorre cada desviacion resuelta por el servicio
                    let desv: Desviacion = FilterQuery.dtoToObject(dto);
                    desv['selected'] = false;
                    for (let anSync of analisisSyncList) {
                        // Recorre los analisis por sincronizar
                        for (const desvSync of anSync.desviacionesList) {
                            // Recorre las desviaciones de cada analisis
                            if (desvSync.hashId == desv.hashId) {
                                desv['analizado'] = true;
                                break;
                            }
                        }
                    }
                    this.desviacionesList.push(desv);
                });
                this.loading = false;
                if (refreshEvent != null) refreshEvent.target.complete();
            })
            .catch((err) => {
                this.loading = null;
                if (refreshEvent != null) refreshEvent.target.complete();
            });
    }

    onEvent(event) {
        if (event == null) {
            return;
        }
        if (event.type == 'onLoad') {
            this.inicializar(event.analisisList);
        } else if (event.type == 'onLocalRemove') {
            event.analisis.desviacionesList.forEach((desv: Desviacion) => {
                let desvEnc = this.buscarDesviacion(desv.hashId);
                if (desvEnc != null) desvEnc['analizado'] = false;
            });
        } else if (event.type == 'onSync') {
            event.analisis.desviacionesList.forEach((desv) => {
                let desvEnc = this.buscarDesviacion(desv.hashId);
                if (desvEnc != null) desvEnc.analisisId = event.analisis.id;
            });
        }
        this.analisisCount = event.count;
    }

    buscarDesviacion(hashId: string): Desviacion {
        if (this.desviacionesList == null) {
            return null;
        }
        for (let i = 0; i < this.desviacionesList.length; i++) {
            if (hashId == this.desviacionesList[i].hashId) {
                return this.desviacionesList[i];
            }
        }
        if (this.desviacionesFavList == null) {
            return null;
        }
        for (let i = 0; i < this.desviacionesFavList.length; i++) {
            if (hashId == this.desviacionesFavList[i].hashId) {
                return this.desviacionesFavList[i];
            }
        }
    }

    navegar(url) {
        this.router.navigate([url]);
    }

    removerDuplicados(array, criteriaField: string) {
        let unique = {};
        array.forEach((element) => {
            unique[element[criteriaField]] = element;
        });

        let newArray = [];
        for (const key in unique) {
            newArray.push(unique[key]);
        }
        return newArray;
    }

    async iniciarAnalisis() {
        if (this.desvListSelect.length == 0) {
            this.msgService.showMessage({
                tipoMensaje: 'warn',
                mensaje: 'Desviación no seleccionada',
                detalle: 'Debe seleccionar al menos una desviación para iniciar la investigación',
            });
            return;
        }

        let desvList = this.removerDuplicados(this.desvListSelect, 'hashId');
        const modal = await this.modalController.create({
            component: InvestigacionDesviacionesComponent,
            componentProps: { valor: desvList, operacion: 'POST' },
            cssClass: 'modal-fullscreen',
        });
        modal.onDidDismiss().then((resp) => this.onModalDismiss(resp.data));
        return await modal.present();
    }

    onModalDismiss(event: any) {
        if (event == null) {
            return;
        }
        let analisis = event.analisisDesviacion;
        let desviaciones: Desviacion[] = event.desviaciones;
        if (analisis != null) {
            if (event.offline == true) {
                this.analisisCount += 1;
                this.analisisDesvSyncComp.adicionarAnalisis(analisis);
            }
            for (let j = 0; j < desviaciones.length; j++) {
                let enviado = analisis.id != null;
                // Elimina del listado actual la desviacion si analisis.id es diferente de null (eso indica que fue enviado el analisis al servidor)
                let desv = this.buscarDesviacion(desviaciones[j].hashId);
                if (desv == null) {
                    continue;
                }
                if (!enviado) {
                    desv['analizado'] = true;
                    desv['selected'] = false;
                } else {
                    desv.analisisId = analisis.id;
                }
            }
            this.desvListSelect = null;
        }
    }

    segmentChanged(event) {
        for (var seg in this.segments) {
            this.segments[seg] = false;
            if (event.detail.value == seg) this.segments[seg] = true;
        }
    }

    pinDesv(desv: Desviacion, idx: number) {
        desv['oculto'] = true;
        if (this.desviacionesFavList == null) this.desviacionesFavList = [];

        let repetido = false;
        for (const desvFav of this.desviacionesFavList) {
            if (desvFav.hashId == desv.hashId) {
                repetido = true;
                break;
            }
        }
        if (repetido == false) {
            this.desviacionesFavList.push(desv);
            this.storageService.setDesviacionFav([desv]);
            if (desv.analisisId != null) {
                this.analisisService.find(desv.analisisId).then((resp: AnalisisDesviacion) => {
                    this.storageService.guardarAnalisisDesviacion(resp);
                });
            }
        }
        this.presentToast('La desviacion ha sido fijada (desliza a la izquierda para visualizar)');
    }

    unpinDesv(desv: Desviacion, idx: number) {
        this.storageService.borrarDesviacionFav(desv.hashId);
        desv['oculto'] = false;
        this.desviacionesFavList.splice(idx, 1);
        this.presentToast('La desviacion ha sido devuelta');
    }

    filtrarModulo(event) {
        this.desviacionesList = [];
        this.count = 0;
        this.filtModulo = event.detail.value;
        this.filtrar(false);
    }

    filtrarInvestigado(event) {
        this.desviacionesList = [];
        this.count = 0;
        this.filtInvest = <boolean>event.detail.value;
        this.filtrar(false);
    }

    filtrarConcepto(event) {
        this.desviacionesList = [];
        this.count = 0;
        this.filtConcepto = event.detail.value;
        this.filtrar(false);
    }

    filtrarAspecto(event) {
        this.desviacionesList = [];
        this.count = 0;
        this.filtAspecto = event.detail.value;
        this.filtrar(false);
    }

    // filtrarJerarquia(event) {
    //     this.desviacionesList = [];
    //     this.count = 0;
    //     this.filtrarJerarquia = event.detail.value;
    //     this.filtrar(false);
    // }

    filtrarCodigo(event) {
        this.desviacionesList = [];
        this.count = 0;
        this.filtCodigo = event.detail.value;
        this.filtrar(false);
    }

    filtrarArea(event) {
        this.desviacionesList = [];
        this.count = 0;
        this.filtArea = event.detail.value;
        this.filtrar(true);
    }

    loadMore() {
        this.count = this.count + 3;
        console.log(this.count, this.desviacionesList);
        this.filtrar(false);
        console.log(this.count);
    }

    filtrar(lm) {
        this.loading = true;
        let filterQuery = new FilterQuery();
        filterQuery.sortField = 'fechaReporte';
        filterQuery.count = true;
        filterQuery.sortOrder = 1;
        filterQuery.offset = 0 + this.count;
        filterQuery.rows = 3;
        filterQuery.fieldList = ['hashId', 'modulo', 'aspectoCausante', 'concepto', 'area_nombre', 'fechaReporte', 'analisisId'];

        filterQuery.filterList = [];
        if (this.filtModulo != null && this.filtModulo.length > 0) {
            filterQuery.filterList.push({
                criteria: Criteria.EQUALS,
                field: 'modulo',
                value1: this.filtModulo,
            });
        }

        if (this.filtInvest != null) {
            filterQuery.filterList.push({
                criteria: this.filtInvest ? Criteria.IS_NOT_NULL : Criteria.IS_NULL,
                field: 'analisisId',
                value1: null,
            });
        }

        if (this.filtAspecto != null && this.filtAspecto.length > 0) {
            filterQuery.filterList.push({
                criteria: Criteria.LIKE,
                field: 'aspectoCausante',
                value1: '%' + this.filtAspecto.toUpperCase() + '%',
            });
        }

        /* if (this.filtJerarquia != null && this.filtJerarquia.length > 0) {
            filterQuery.filterList.push({
                criteria: Criteria.LIKE,
                field: 'jerarquia',
                value1: '%' + this.filtJerarquia + '%',
            });
        }*/

        if (this.filtConcepto != null && this.filtConcepto.length > 0) {
            filterQuery.filterList.push({
                criteria: Criteria.LIKE,
                field: 'concepto',
                value1: '%' + this.filtConcepto + '%',
            });
        }

        if (this.filtCodigo != null && this.filtCodigo.length > 0) {
            filterQuery.filterList.push({
                criteria: Criteria.LIKE,
                field: 'hashId',
                value1: '%' + this.filtCodigo + '%',
            });
        }

        if (this.filtArea != null && this.filtArea.length > 0) {
            filterQuery.filterList.push({
                criteria: Criteria.LIKE,
                field: 'area.nombre',
                value1: '%' + this.filtArea.toUpperCase() + '%',
            });
        }
        this.offlineService
            .queryDesviaciones(filterQuery)
            .then((resp) => {
                let count = <number>resp['count'];
                console.log(count);
                (<any[]>resp['data']).forEach((dto) => {
                    let desv: Desviacion = FilterQuery.dtoToObject(dto);
                    desv['selected'] = false;
                    this.desviacionesList.push(desv);
                    if (this.count >= count) this.disabled = true;
                });
                this.loading = false;
                this.cargarSeleccionados();
            })
            .catch((err) => (this.loading = false));
    }

    cargarSeleccionados() {
        for (let i = 0; i < this.desviacionesList.length; i++) {
            for (let j = 0; j < this.desvListSelect.length; j++) {
                if (this.desvListSelect[j].hashId == this.desviacionesList[i].hashId) {
                    this.desviacionesList[i]['selected'] = true;
                    break;
                }
            }
        }
    }

    async abrirAnalisis(desviacion: Desviacion, operacion: string) {
        const modal = await this.modalController.create({
            component: InvestigacionDesviacionesComponent,
            componentProps: { valor: desviacion, operacion: operacion },
            cssClass: 'modal-fullscreen',
        });
        modal.onDidDismiss().then((resp) => this.onModalDismiss(resp.data));
        return await modal.present();
    }

    async presentToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 5000,
        });
        toast.present();
    }
}
