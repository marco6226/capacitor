import { NumeroEconomico } from './../../inp/entities/numero-economico';
import { ObservacionService } from './../../auc/services/observacion.service';
import { Inspeccion } from './../../inp/entities/inspeccion';
import { ProgramacionService } from '../../inp/services/programacion.service';
import { FilterQuery } from '../entities/filter-query';
import { SesionService } from './sesion.service';
import { Filter, Criteria } from '../entities/filter';
import { Injectable } from '@angular/core';
import { ListaInspeccionService } from '../../inp/services/lista-inspeccion.service';
import { SistemaNivelRiesgoService } from './sistema-nivel-riesgo.service';
import { MensajeUsuario } from '../entities/mensaje-usuario';
import { TarjetaService } from '../../auc/services/tarjeta.service';
import { AreaService } from '../../emp/services/area.service';
import { SistemaCausaRaizService } from '../../sec/services/sistema-causa-raiz.service';
import { SistemaCausaInmediataService } from '../../sec/services/sistema-causa-inmediata.service';
import { DesviacionService } from './../../sec/services/desviacion.service';
import { StorageService } from './storage.service';
import { ActaService } from '../../cop/services/acta.service';
import { SistemaCausaAdministrativaService } from '../../sec/services/sistema-causa-administrativa.service';
import { Subject } from 'rxjs';
import { ManualService } from './manual.service';
import { InspeccionService } from '../../inp/services/inspeccion.service';
import { Platform } from '@ionic/angular';


@Injectable()
export class OfflineService {
    public toggleSubject = new Subject<boolean>();
    public sessionService: SesionService;
    areasPermiso: string;

    constructor(
        private sistCausAdminService: SistemaCausaAdministrativaService,
        private storageService: StorageService,
        private desviacionService: DesviacionService,
        private areaService: AreaService,
        private tarjetaService: TarjetaService,
        private programacionService: ProgramacionService,
        private listaInspeccionService: ListaInspeccionService,
        private sistemaNivelRiesgoService: SistemaNivelRiesgoService,
        private sistemaCausaRaizService: SistemaCausaRaizService,
        private SistemaCausaInmediataService: SistemaCausaInmediataService,
        // public sessionService: SesionService,
        private manualService: ManualService,
        private actaService: ActaService,
        private observacionService: ObservacionService,
        private inspeccionService: InspeccionService,
        private platform: Platform,
        // private numeroEconomico: NumeroEconomico
    ) {
        this.sessionService = this.storageService.getSessionService();
        platform.ready().then(() => {

            if (this.platform.is('android')) {
                console.log("running on Android device!");
            }
            if (this.platform.is('ios')) {
                console.log("running on iOS device!");
            }
            if (this.platform.is('mobileweb')) {
                console.log("running in a browser on mobile!");
            }
        });
    }

    getOfflineMode(): boolean {
        return this.sessionService.getOfflineMode();
    }

    setOfflineMode(offlineMode) {
        this.sessionService.setOfflineMode(offlineMode);
        this.toggleSubject.next(offlineMode);
    }

    queryManualesPorUsuario(): any {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getManualesUsuario();
        } else {
            return this.manualService.buscarPorUsuario();
        }
    }

    querySistemaCausaAdmin(): any {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getSistemaCausaAdministrativa();
        } else {
            return this.sistCausAdminService.findDefault();
        }
    }

    queryListasInspeccion(completo?: boolean) {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getListasInspeccion();
        } else {
            let filterQuery = new FilterQuery();
            filterQuery.sortField = 'nombre';
            // filterQuery.rows = 10
            filterQuery.sortOrder = -1;
            if (!completo) {
                filterQuery.fieldList = ['listaInspeccionPK', 'nombre', 'codigo', 'descripcion', 'estado'];
                filterQuery.filterList = [];
                filterQuery.filterList.push({
                    criteria: Criteria.NOT_EQUALS,
                    field: 'estado',
                    value1: 'inactivo',
                });
            }

            return this.listaInspeccionService.findByFilter(filterQuery);
        }
    }

    queryListasInspeccionFiltro(filterQuery: FilterQuery) {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getListasInspeccion();
        } else {
            //let filterQuery = new FilterQuery();
            filterQuery.sortField = 'nombre';
            filterQuery.sortOrder = -1;

            filterQuery.fieldList = ['listaInspeccionPK', 'nombre', 'codigo', 'descripcion', 'estado'];

            return this.listaInspeccionService.findByFilter(filterQuery);
        }
    }

    querySistemaCausaInmediata(): any {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getSistemaCausaInmediata();
        } else {
            return this.SistemaCausaInmediataService.findDefault();
        }
    }

    queryDesviaciones(filterQuery?: FilterQuery, completo?: boolean) {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getDesviaciones();
        } else {
            let areasPerm = this.sessionService.getPermisosMap()['SEC_GET_DESV'].areas;
            if (filterQuery == null) {
                filterQuery = new FilterQuery();
                filterQuery.sortField = 'modulo';
                // filterQuery.sortOrder = 1;
                filterQuery.offset = 0;
                filterQuery.rows = 5;
                filterQuery.fieldList = ['hashId', 'modulo', 'aspectoCausante', 'concepto', 'area_nombre', 'analisisId'];
                filterQuery.filterList = [{ criteria: Criteria.CONTAINS, field: 'area.id', value1: areasPerm }];
            } else if (filterQuery.filterList != null) {
                filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: areasPerm });
            } else {
                filterQuery.filterList = [{ criteria: Criteria.CONTAINS, field: 'area.id', value1: areasPerm }];
            }
            return this.desviacionService.findByFilter(filterQuery);
        }
    }

    queryActasCopasst() {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getActasCopasst();
        } else {
            let areas = this.sessionService.getPermisosMap()['COP_GET_ACT'].areas;
            let filterQuery = new FilterQuery();
            filterQuery.sortField = 'fechaElaboracion';

            filterQuery.sortOrder = 1;
            filterQuery.offset = 0;
            filterQuery.rows = 24;
            filterQuery.count = true;
            filterQuery.filterList = [{ field: 'area.id', value1: areas, criteria: Criteria.CONTAINS }];
            //filterQuery.fieldList = ['id', 'nombre', 'fechaElaboracion', 'descripcion', 'area_id', 'area_nombre', 'documentosList_id', 'documentosList_nombre'];
            return this.actaService.findByFilter(filterQuery);
        }
    }

    querySistemaCausaRaiz(): any {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getSistemaCausaRaiz();
        } else {
            return this.sistemaCausaRaizService.findDefault();
        }
    }

    queryArea(): any {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getAreas();
        } else {
            let fq = new FilterQuery();
            //fq.fieldList = ["id", "nombre"];
            fq.sortField = 'nombre';
            fq.sortOrder = -1;
            fq.filterList = [{ field: 'areaPadre.id', criteria: Criteria.IS_NULL, value1: null }];
            return this.areaService.buscarPorFiltro(fq, false);
        }
    }

    queryTarjetaObservacion(): any {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getTarjetas();
        } else {
            return this.tarjetaService.findByFilter();
        }
    }

    queryObservacion(completo?: boolean): any {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getSyncObservaciones();
        } else {
            
            let areasPermiso = this.sessionService.getPermisosMap()['AUC_GET_OBS'].areas;
            console.log(areasPermiso)
            let filterQuery = new FilterQuery();
            filterQuery.offset = 0;
            //filterQuery.rows = 30
            filterQuery.count = true;
            filterQuery.sortField = 'fechaObservacion';
            filterQuery.sortOrder = 1;
            if (!completo) {
                filterQuery.fieldList = ['id', 'fechaObservacion', 'tipoObservacion', 'descripcion', 'nivelRiesgo_nombre', 'personasobservadas', 'personasabordadas', 'aceptada','area',
                'area_id',
                'area_nombre'];
                filterQuery.filterList = [];
                /* filterQuery.filterList.push({
                    criteria: Criteria.NOT_EQUALS,
                    field: "estado",
                    value1: "inactivo"});*/
                    filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: areasPermiso });
            }
            return this.observacionService.findByFilter(filterQuery);
        }
    }

    

    querySistemaNivelRiesgo() {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getSistemaNivelRiesgo();
        } else {
            let filterQuery = new FilterQuery();
            let filter = new Filter();
            filter.criteria = Criteria.EQUALS;
            filter.field = 'seleccionado';
            filter.value1 = 'true';
            filterQuery.filterList = [filter];
            return this.sistemaNivelRiesgoService.findByFilter(filterQuery);
        }
    }

    queryObservacionSelectID(idNum: string): any {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getSyncObservaciones();
        } else {
            let filterQuery = new FilterQuery();

            filterQuery.filterList = [
                {
                    criteria: Criteria.EQUALS,
                    field: 'id',
                    value1: idNum,
                },
            ];
            console.log(filterQuery);
            return this.observacionService.findByFilter(filterQuery);
        }
    }

    queryProgramacionList() {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getProgramaciones();
        } else {
            let filterQuery = new FilterQuery();
            filterQuery.sortField = 'fecha';
            filterQuery.sortOrder = 1;
            // filterQuery.rows = 10
            filterQuery.fieldList = ['id', 'fecha', 'area_id','area_nombre', 'listaInspeccion_listaInspeccionPK', 'listaInspeccion_nombre', 'numeroInspecciones', 'numeroRealizadas'];
            let areas = this.sessionService.getPermisosMap()['INP_GET_PROG'].areas;
            filterQuery.filterList = [
                {
                    criteria: Criteria.CONTAINS,
                    field: 'area.id',
                    value1: areas == null ? null : areas.toString(),
                },
                {
                    criteria: Criteria.NOT_EQUALS,
                    field: 'numeroInspecciones',
                    value1: 'numeroRealizadas',
                    isExpression: true,
                },
            ];
            return this.programacionService.findByFilter(filterQuery);
        }
    }

    queryProgramacionListBetween(desde: Date, hasta: Date) {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getProgramaciones();
        } else {
            let filterQuery = new FilterQuery();
            filterQuery.sortField = 'fecha';
            filterQuery.sortOrder = 1;
            filterQuery.fieldList = ['id', 'fecha', 'area_id','area_nombre', 'listaInspeccion_listaInspeccionPK', 'listaInspeccion_nombre', 'numeroInspecciones', 'numeroRealizadas'];
            let areas = this.sessionService.getPermisosMap()['INP_GET_PROG'].areas;
            filterQuery.filterList = [
                {
                    criteria: Criteria.CONTAINS,
                    field: 'area.id',
                    value1: areas == null ? null : areas.toString(),
                },
                {
                    criteria: Criteria.NOT_EQUALS,
                    field: 'numeroInspecciones',
                    value1: 'numeroRealizadas',
                    isExpression: true,
                },
                {
                    criteria: Criteria.BETWEEN,
                    field: 'fecha',
                    value1: desde.toLocaleString(),
                    value2: hasta.toLocaleString(),
                },
            ];

            return this.programacionService.findByFilter(filterQuery);
        }
    }

    queryInspeccionSelectID(idNum: string): any {
        // if (this.sessionService.getOfflineMode()) {
        //     return this.storageService.getSyncObservaciones();
        // } else {
            let filterQuery = new FilterQuery();

            filterQuery.filterList = [
                {
                    criteria: Criteria.EQUALS,
                    field: 'id',
                    value1: idNum,
                },
            ];
            console.log(filterQuery);
            return this.inspeccionService.findByFilter(filterQuery);
        // }
    }

    queryInspeccionesRealizadas() {
        this.areasPermiso = this.sessionService.getPermisosMap()['INP_GET_INP'].areas;
        // if (this.sessionService.getOfflineMode()) {
        //     return this.storageService.getInspeccionesRealizadas();
        // } else {
        let filterQuery = new FilterQuery();
        filterQuery.offset = 0;
        // filterQuery.rows = 10
        filterQuery.count = true;
        filterQuery.sortField = 'fechaRealizada';
        filterQuery.sortOrder = 1;
        filterQuery.fieldList = [
            'id',
            'fechaRealizada',
            'observacion',
            'lugar',
            'equipo',
            'descripcion',
            'fechaModificacion',
            'area_nombre',
            'empresa_nombreComercial',
            'usuarioRegistra_email',
            'listaInspeccion_nombre',
            'programacion_fecha',
            'programacion_listaInspeccion_nombre',
            'programacion_area_id',
            'programacion_area_nombre',
            'usuarioModifica_email'
            //'listaInspeccion_elementoInspeccionList'
        
        ];
        filterQuery.filterList = [
            {
                criteria: Criteria.CONTAINS,
                field: 'programacion.area.id',
                value1: this.areasPermiso,                // isExpression: true,
            },
        ];
        return this.inspeccionService.findByFilter(filterQuery);
        // }
    }

    queryRealizadasListBetween(desde: Date, hasta: Date) {
        // if (this.sessionService.getOfflineMode()) {
        //     return this.storageService.getProgramaciones();
        // } else {
            const filterQuery = new FilterQuery();
            filterQuery.sortField = 'fechaRealizada';
            filterQuery.sortOrder = 1;
            filterQuery.fieldList = [
                'id',
                'fechaRealizada',
                'observacion',
                'lugar',
                'equipo',
                'descripcion',
                'fechaModificacion',
                'area_nombre',
                'empresa_nombreComercial',
                'usuarioRegistra_email',
                'listaInspeccion_nombre',
                'listaInspeccion_usarTipoHallazgo',
                'listaInspeccion_usarNivelRiesgo',
                //'listaInspeccion_elementoInspeccionList',
                // 'listaInspeccion_opcionCalificacionList'

            ];
            // let areas = this.sessionService.getPermisosMap()['INP_GET_PROG'].areas;
            filterQuery.filterList = [
                {
                    criteria: Criteria.BETWEEN,
                    field: 'fechaRealizada',
                    value1: desde.toLocaleString(),
                    value2: hasta.toLocaleString(),
                },
            ];
            filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: "programacion.area.id", value1: this.areasPermiso });
            return this.inspeccionService.findByFilter(filterQuery);
        // }
    }

    queryInspeccionesRealizadasNoProg() {
        this.areasPermiso = this.sessionService.getPermisosMap()['INP_GET_INP'].areas;
        // if (this.sessionService.getOfflineMode()) {
        //     return this.storageService.getInspeccionesRealizadas();
        // } else {
        let filterQuery = new FilterQuery();
        filterQuery.offset = 0;
        // filterQuery.rows = 10
        filterQuery.count = true;
        filterQuery.sortField = 'fechaRealizada';
        filterQuery.sortOrder = 1;
        filterQuery.fieldList = [
            // 'id',
            // 'fechaRealizada',
            // 'observacion',
            // 'lugar',
            // 'equipo',
            // 'descripcion',
            // 'fechaModificacion',
            // 'area_nombre',
            // 'empresa_nombreComercial',
            // 'usuarioRegistra_email',
            // 'listaInspeccion_nombre',
            // 'programacion_fecha',
            // 'programacion_listaInspeccion_nombre',
            // 'programacion_area_id',
            // 'programacion_area_nombre',
            // 'usuarioModifica_email'
            //'listaInspeccion_elementoInspeccionList'
            'id',
            'fechaRealizada',
            'usuarioRegistra_email',
            'listaInspeccion_nombre',
            'area_id',
            'area_nombre',
            'fechaModificacion',
            'usuarioModifica_email'
        
        ];
        filterQuery.filterList = [
            {
                criteria: Criteria.CONTAINS,
                field: 'area.id',
                value1: this.areasPermiso,
            },
        ];
        filterQuery.filterList.push({ criteria: Criteria.IS_NULL, field: 'programacion' });
        return this.inspeccionService.findByFilter(filterQuery);
        // }
    }

    queryRealizadasListBetweenNoProg(desde: Date, hasta: Date) {
        // if (this.sessionService.getOfflineMode()) {
        //     return this.storageService.getProgramaciones();
        // } else {
            const filterQuery = new FilterQuery();
            filterQuery.sortField = 'fechaRealizada';
            filterQuery.sortOrder = 1;
            filterQuery.fieldList = [
                'id',
                'fechaRealizada',
                'usuarioRegistra_email',
                'listaInspeccion_nombre',
                'area_id',
                'area_nombre',
                'fechaModificacion',
                'usuarioModifica_email'

            ];
            // let areas = this.sessionService.getPermisosMap()['INP_GET_PROG'].areas;
            filterQuery.filterList = [
                {
                    criteria: Criteria.BETWEEN,
                    field: 'fechaRealizada',
                    value1: desde.toLocaleString(),
                    value2: hasta.toLocaleString(),
                },
            ];
            filterQuery.filterList.push({ criteria: Criteria.CONTAINS, field: 'area.id', value1: this.areasPermiso });
            filterQuery.filterList.push({ criteria: Criteria.IS_NULL, field: 'programacion' });
            return this.inspeccionService.findByFilter(filterQuery);
        // }
    }

    queryListaInspeccion(idLista: string, versionLista: number) {
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getListaInspeccion(idLista, versionLista);
        } else {
            let filterQuery = new FilterQuery();
            let filterId = new Filter();
            filterId.criteria = Criteria.EQUALS;
            filterId.field = 'listaInspeccionPK.id';

            filterId.value1 = idLista;
            let filterVersion = new Filter();
            filterVersion.criteria = Criteria.EQUALS;
            filterVersion.field = 'listaInspeccionPK.version';

            filterVersion.value1 = '' + versionLista;
            filterQuery.filterList = [filterId, filterVersion];
            return this.listaInspeccionService.findByFilter(filterQuery);
        }
    }

    queryListaInspeccionFilter(filterQuery?: FilterQuery, completo?: boolean) {
        console.log(filterQuery);
        if (this.sessionService.getOfflineMode()) {
            return this.storageService.getListasInspeccion();
        } else {
            let areasPerm = this.sessionService.getPermisosMap()['INP_GET_LISTINP'].areas;
            let filterQuery = new FilterQuery();
            let carga = 'Carga';
            filterQuery.fieldList = ['nombre'];
            filterQuery.filterList = [{ criteria: Criteria.LIKE, field: 'nombre', value1: carga }];
            //filterQuery.filterList = [filterVersion];
            console.log(Criteria, filterQuery);
            return this.listaInspeccionService.findByFilter(filterQuery);
        }
    }

    loadData() {
        let permSistemaCR = this.sessionService.getPermisosMap()['SEC_GET_SCRDEF'];
        permSistemaCR = permSistemaCR == null ? { valido: false } : permSistemaCR;
        
        let permAreas = this.sessionService.getPermisosMap()['EMP_GET_AREA'];
        permAreas = permAreas == null ? { valido: false } : permAreas;

        let permTarjetaObser = this.sessionService.getPermisosMap()['AUC_GET_TARJ'];
        permTarjetaObser = permTarjetaObser == null ? { valido: false } : permTarjetaObser;

        let permSistemaNR = this.sessionService.getPermisosMap()['SEC_GET_SISTNR'];
        permSistemaNR = permSistemaNR == null ? { valido: false } : permSistemaNR;

        let permProgInsp = this.sessionService.getPermisosMap()['INP_GET_PROG'];
        permProgInsp = permProgInsp == null ? { valido: false } : permProgInsp;

        let permListActCop = this.sessionService.getPermisosMap()['COP_GET_ACT'];
        permListActCop = permListActCop == null ? { valido: false } : permListActCop;

        let permListDesv = this.sessionService.getPermisosMap()['SEC_GET_DESV'];
        permListDesv = permListDesv == null ? { valido: false } : permListDesv;

        let permListCausInm = this.sessionService.getPermisosMap()['SEC_GET_DESV'];
        permListCausInm = permListCausInm == null ? { valido: false } : permListCausInm;

        let permListasInspeccion = this.sessionService.getPermisosMap()['INP_GET_LISTINP'];
        permListasInspeccion = permListasInspeccion == null ? { valido: false } : permListasInspeccion;

        let permListCausAdmin = this.sessionService.getPermisosMap()['SEC_GET_DESV'];
        permListCausAdmin = permListCausAdmin == null ? { valido: false } : permListCausAdmin;

        let permManUsr = this.sessionService.getPermisosMap()['CONF_GET_MANUSR'];
        permManUsr = permManUsr == null ? { valido: false } : permManUsr;

        let queries = {
            querySistemaCausaRaiz: !permSistemaCR.valido,
            queryArea: !permAreas.valido,
            queryTarjetaObservacion: !permTarjetaObser.valido,
            querySistemaNivelRiesgo: !permSistemaNR.valido,
            queryProgramacionList: !permProgInsp.valido,
            queryActasCopasst: !permListActCop.valido,
            queryDesviaciones: !permListDesv.valido,
            querySistemaCausaInm: !permListCausInm.valido,
            queryListasInspeccion: !permListasInspeccion.valido,
            querySistemaCausaAdmin: !permListCausAdmin.valido,
            queryManualesPorUsuario: !permManUsr.valido,
        };
        this.setOfflineMode(false);

        return new Promise<void>((resolve, reject) => {
            // Queries manuales de usuario
            if (permManUsr.valido) {
                this.queryManualesPorUsuario()
                    .then((resp) => {
                        this.storageService.setManualesUsuario(resp['data']);
                        if (this.verificarCarga(queries, 'queryManualesPorUsuario')) resolve();
                    })
                    .catch((err) => reject(err));
            }

            // Queries sistema causa administrativa
            if (permListCausAdmin.valido) {
                this.querySistemaCausaAdmin()
                    .then((resp) => {
                        this.storageService.setSistemaCausaAdministrativa([resp]);
                        if (this.verificarCarga(queries, 'querySistemaCausaAdmin')) resolve();
                    })
                    .catch((err) => reject(err));
            }

            // Queries sistema Listas inspeccion
            if (permListasInspeccion.valido) {
                this.queryListasInspeccion(true)
                    .then((resp) => {
                        this.storageService.setListasInspeccion(resp['data']);
                        if (this.verificarCarga(queries, 'queryListasInspeccion')) resolve();
                    })
                    .catch((err) => reject(err));
            }

            // Queries sistema causa inmediata
            if (permListCausInm.valido) {
                this.querySistemaCausaInmediata()
                    .then((resp) => {
                        this.storageService.setSistemaCausaInmediata([resp]);
                        if (this.verificarCarga(queries, 'querySistemaCausaInm')) resolve();
                    })
                    .catch((err) => (err) => reject(err));
            }

            // Queries desviaciones
            if (permListDesv.valido) {
                this.queryDesviaciones(null, true)
                    .then((resp) => {
                        this.storageService.setDesviaciones(resp['data']);
                        if (this.verificarCarga(queries, 'queryDesviaciones')) resolve();
                    })
                    .catch((err) => reject(err));
            }

            // Queries Actas COPASST
            if (permListActCop.valido) {
                this.queryActasCopasst()
                    .then((resp) => {
                        this.storageService.setActasCopasst(resp['data']);
                        if (this.verificarCarga(queries, 'queryActasCopasst')) resolve();
                    })
                    .catch((err) => reject(err));
            }

            // Queries AREAS
            if (permAreas.valido) {
                this.queryArea()
                    .then((resp) => {
                        this.storageService.setAreas(resp['data']);
                        if (this.verificarCarga(queries, 'queryArea')) resolve();
                    })
                    .catch((err) => reject(err));
            }

            // Queries CAUSA RAIZ
            if (permSistemaCR.valido) {
                this.querySistemaCausaRaiz()
                    .then((resp) => {
                        this.storageService.setSistemaCausaRaiz([resp]);
                        if (this.verificarCarga(queries, 'querySistemaCausaRaiz')) resolve();
                    })
                    .catch((err) => reject(err));
            }

            // Queries OBSERVACIONES
            if (permTarjetaObser.valido) {
                this.queryTarjetaObservacion()
                    .then((resp) => {
                        this.storageService.setTarjetas(resp);
                        if (this.verificarCarga(queries, 'queryTarjetaObservacion')) resolve();
                    })
                    .catch((err) => reject(err));
            }

            // Queries INSPECCIONES

            if (permSistemaNR.valido) {
                this.querySistemaNivelRiesgo()
                    .then((resp) => {
                        this.storageService.setSistemaNivelRiesgo(resp['data']);
                        if (this.verificarCarga(queries, 'querySistemaNivelRiesgo')) resolve();
                    })
                    .catch((err) => reject(err));
            }

            if (permProgInsp.valido) {
                let listas = {};
                this.queryProgramacionList()
                    .then((resp) => {
                        this.storageService.setProgramaciones(resp['data']);
                        if (this.verificarCarga(queries, 'queryProgramacionList')) resolve();
                    })
                    .catch((err) => reject(err));
            }
        });
    }

    verificarCarga(ctrlQueries: any, queriFin) {
        ctrlQueries[queriFin] = true;
        for (let key in ctrlQueries) {
            if (ctrlQueries[key] == false) return false;
        }
        this.setOfflineMode(true);
        return true;
    }

    sincronizar() {
        this.setOfflineMode(false);
        return new Promise((resolve, reject) => {
            let msg: MensajeUsuario = {
                tipoMensaje: 'info',
                mensaje: 'Modo online activado',
                detalle: '',
            };
            this.clearLocalStorage();
            resolve(msg);
        });
    }
    clearLocalStorage() {
        console.log(this.platform);
        if (!this.platform.is('mobileweb')) {
            console.log("running in mobile!");
        
        console.log(this.platform)
        this.storageService.borrarSistemaNivelRiesgo();
        this.storageService.borrarProgramaciones();
        this.storageService.borrarAreas();
        this.storageService.borrarTarjetas();
        this.storageService.borrarSistemaCausaRaiz();
        this.storageService.borrarActasCopasst();
        this.storageService.borrarDesviaciones();
        this.storageService.borrarSistemaCausaInmediata();
        this.storageService.borrarListasInspeccion();
        this.storageService.borrarManualesUsuario();
    }
    }
}
