import { Injectable, EventEmitter } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ListaInspeccion } from '../../inp/entities/lista-inspeccion';
import { Inspeccion } from '../../inp/entities/inspeccion';
import { SistemaCausaInmediata } from '../../sec/entities/sistema-causa-inmediata';
import { Desviacion } from '../../sec/entities/desviacion';
import { SistemaCausaRaiz } from '../../sec/entities/sistema-causa-raiz';
import { Area } from '../../emp/entities/area';
import { SistemaNivelRiesgo } from '../entities/sistema-nivel-riesgo';
import { Programacion } from '../../inp/entities/programacion';
import { Acta } from '../../cop/entities/acta';
import { AnalisisDesviacion } from '../../sec/entities/analisis-desviacion';
import { Manual } from '../entities/manual';
import { SesionService } from './sesion.service';
import { Observacion } from '../../auc/entities/observacion';

@Injectable()
export class StorageService {
    database: SQLiteObject;

    constructor(private sqlite: SQLite, public sessionService: SesionService) {}

    getSessionService(): any {
        return this.sessionService;
    }

    getEmpresa(): any {
        return this.sessionService.getEmpresa();
    }

    init() {
        let controller = this.sqlite.create({
            name: 'sigess_db',
            location: 'default',
        });
        if (controller != null) {
            controller
                .then((db: SQLiteObject) => {
                    this.database = db;
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS inp_lista_inspeccion_v2(id integer, version integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS inp_inspeccion_v2(hashid integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS inp_inspeccion_pendiente_v2(hashid integer, body text, empresa_id text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS inp_inspeccion_realizada_v2(hashid integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_sistema_causa_inmediata_v2(id integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_desviacion_v2(id text, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS cop_acta_v2(id integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_sistema_causa_raiz_v2(id integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS emp_area_v2(id integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS auc_tarjeta_v2(id integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_sistema_nivel_riesgo_v2(id integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS inp_programacion_v2(id integer, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_sistema_causa_administrativa_v2(id integer, body text, empresa_id text)', []);

                    this.database.executeSql('CREATE TABLE IF NOT EXISTS cop_acta_sync_v2(hashId text, id text, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS auc_observacion_sync_v2(hashId text, id text, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_analisis_desv_sync_v2(hashId text, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_analisis_desviacion_v2(id text, body text, empresa_id text)', []);
                    this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_desviacion_fav_v2(id text, body text, empresa_id text)', []);

                    this.database.executeSql('CREATE TABLE IF NOT EXISTS conf_manual_usuario_v2(id text, body text, empresa_id text)', []);

                    /** TABLAS OBSOLETAS - NO CUENTAN CON CAMPO empresa_id Y GENERAN INCOHERENCIA DE DATOS AL CAMBIAR DE EMPRESAS */

                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS inp_lista_inspeccion(id integer, version integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS inp_inspeccion(hashid integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS inp_inspeccion_pendiente(hashid integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_sistema_causa_inmediata(id integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_desviacion(id text, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS cop_acta(id integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_sistema_causa_raiz(id integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS emp_area(id integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS auc_tarjeta(id integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_sistema_nivel_riesgo(id integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS inp_programacion(id integer, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_sistema_causa_administrativa(id integer, body text)', []);

                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS cop_acta_sync(hashId text, id text, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS auc_observacion_sync(hashId text, id text, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_analisis_desv_sync(hashId text, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_analisis_desviacion(id text, body text)', []);
                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS sec_desviacion_fav(id text, body text)', []);

                    // this.database.executeSql('CREATE TABLE IF NOT EXISTS conf_manual_usuario(id text, body text)', []);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            alert('Almacenamiento local no disponible en este dispositivo');
        }
    }

    //********** INSPECCIONES ******************** */

    guardarInspeccion(inspeccion: Inspeccion): any {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO inp_inspeccion_v2(hashid, body, empresa_id) VALUES (?, ?, ?)';
            this.database
                .executeSql(sql, [inspeccion['hash'], JSON.stringify(inspeccion), this.getEmpresa().id])
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    getInspecciones(): Promise<Response<Inspeccion[]>> {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT body FROM inp_inspeccion_v2 WHERE empresa_id = ?';
            this.database.executeSql(sql, [this.getEmpresa().id]).then((resultset) => {
                resolve(this.toResolveObject(resultset));
            });
        });
    }

    borrarInspeccion(inspeccion: Inspeccion): any {
        return this.database.executeSql('DELETE FROM inp_inspeccion_v2 WHERE hashid = ?', [inspeccion['hash']]);
    }

    guardarInspeccionPendiente(inspeccion: Inspeccion): any {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO inp_inspeccion_pendiente_v2(hashid, body, empresa_id) VALUES (?, ?, ?)';
            this.database
                .executeSql(sql, [inspeccion['hash'], JSON.stringify(inspeccion), this.getEmpresa().id])
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    actualizarInspeccionPendiente(inspeccion: Inspeccion): any {
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE inp_inspeccion_pendiente_v2 SET body = ? WHERE hashid = ?';
            this.database
                .executeSql(sql, [JSON.stringify(inspeccion), inspeccion['hash']])
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    getInspeccionesPendientes(): Promise<Response<Inspeccion[]>> {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT body FROM inp_inspeccion_pendiente_v2 WHERE empresa_id = ?';
            this.database.executeSql(sql, [this.getEmpresa().id]).then((resultset) => {
                resolve(this.toResolveObject(resultset));
            });
        });
    }

    borrarInspeccionPendiente(inspeccion: Inspeccion): any {
        return new Promise((resolve, reject) => {
        this.database.executeSql('DELETE FROM inp_inspeccion_realizada_v2 WHERE hashid = ?', [inspeccion['hash']])
        .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    guardarInspeccionRealizada(inspeccion: Inspeccion): any {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO inp_inspeccion_pendiente_v2(hashid, body, empresa_id) VALUES (?, ?, ?)';
            this.database
                .executeSql(sql, [inspeccion['hash'], JSON.stringify(inspeccion), this.getEmpresa().id])
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    // actualizarInspeccionRealizada(inspeccion: Inspeccion): any {
    //     return new Promise((resolve, reject) => {
    //         let sql = 'UPDATE inp_inspeccion_realizada_v2 SET body = ? WHERE hashid = ?';
    //         this.database
    //             .executeSql(sql, [JSON.stringify(inspeccion), inspeccion['hash']])
    //             .then(() => resolve())
    //             .catch((err) => reject(err));
    //     });
    // }

    // getInspeccionesRealizadas(): Promise<Response<Inspeccion[]>> {
    //     return new Promise((resolve, reject) => {
    //         let sql = 'SELECT body FROM inp_inspeccion_realizada_v2 WHERE empresa_id = ?';
    //         this.database.executeSql(sql, [this.getEmpresa().id]).then((resultset) => {
    //             resolve(this.toResolveObject(resultset));
    //         });
    //     });
    // }

    //********* LISTAS DE INSPECCIONES ********** */

    getListaInspeccion(idLista: string, versionLista: number): any {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT body FROM inp_lista_inspeccion_v2 WHERE id = ? AND version = ? AND empresa_id = ?';
            this.database
                .executeSql(sql, [idLista, versionLista, this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    getListasInspeccion() {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM inp_lista_inspeccion_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    setListasInspeccion(listInspList: ListaInspeccion[]) {
        return new Promise((resolve, reject) => {
            listInspList.forEach((lista) => {
                let sql = 'INSERT INTO inp_lista_inspeccion_v2(id, version, body, empresa_id) VALUES (?, ?, ?, ?)';
                this.database.executeSql(sql, [lista.listaInspeccionPK.id, lista.listaInspeccionPK.version, JSON.stringify(lista), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    borrarListasInspeccion() {
        this.database.executeSql('DELETE FROM inp_lista_inspeccion_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }

    //********* CAUSA INMEDIATA ********** */

    getSistemaCausaInmediata() {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM sec_sistema_causa_inmediata_v2 WHERE empresa_id = ? LIMIT 1', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset)['data'][0]);
                })
                .catch((err) => reject(err));
        });
    }

    setSistemaCausaInmediata(sistemaCausaInm: SistemaCausaInmediata[]) {
        return new Promise((resolve, reject) => {
            let values: any = ['INSERT INTO sec_sistema_causa_inmediata_v2(id, body, empresa_id) VALUES (?, ?, ?)'];
            sistemaCausaInm.forEach((sci) => {
                values.push([sci.id, JSON.stringify(sci), this.getEmpresa().id]);
            });
            let qBatch = [values];
            this.database
                .sqlBatch(qBatch)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    borrarSistemaCausaInmediata() {
        this.database.executeSql('DELETE FROM sec_sistema_causa_inmediata_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }
    //********* DESVIACIONES ********** */

    getDesviaciones(): Promise<Response<Desviacion[]>> {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM sec_desviacion_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    setDesviaciones(desviaciones: Desviacion[]) {
        return new Promise((resolve, reject) => {
            desviaciones.forEach((desv) => {
                let sql = 'INSERT INTO sec_desviacion_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [desv.hashId, JSON.stringify(desv), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    borrarDesviaciones() {
        this.database.executeSql('DELETE FROM sec_desviacion_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }

    /**
     * Consulta las desviaciones guardadas localmente como "Favoritos"
     */
    getDesviacionesFav(): Promise<Response<Desviacion[]>> {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM sec_desviacion_fav_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    /**
     * Guarda las desviaciones "Favoritas" localmente
     */
    setDesviacionFav(desviaciones: Desviacion[]) {
        return new Promise((resolve, reject) => {
            desviaciones.forEach((desv) => {
                let sql = 'INSERT INTO sec_desviacion_fav_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [desv.hashId, JSON.stringify(desv), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    /**
     * Retira la desviacion especificada del listado de favoritos
     */
    borrarDesviacionFav(hashId: string) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM sec_desviacion_fav_v2 WHERE id = ?';
            this.database.executeSql(sql, [hashId]);
            resolve();
        });
    }
    //********* ACTAS COPASST ********** */

    getActasCopasst() {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM cop_acta_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    setActasCopasst(actas: Acta[]) {
        return new Promise((resolve, reject) => {
            actas.forEach((acta) => {
                let sql = 'INSERT INTO cop_acta_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [acta.id, JSON.stringify(acta), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    borrarActasCopasst() {
        this.database.executeSql('DELETE FROM cop_acta_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }

    guardarSyncActaCopasst(acta: Acta) {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO cop_acta_sync_v2(hashId, body, empresa_id) VALUES (?, ?, ?)';
            this.database.executeSql(sql, [acta['hashId'], JSON.stringify(acta), this.getEmpresa().id]).then(() => resolve());
        });
    }

    getSyncActasCopasst() {
        return new Promise((resolve, reject) => {
            this.database.executeSql('SELECT body FROM cop_acta_sync_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).then((resultset) => {
                resolve(this.toResolveObject(resultset));
            });
        });
    }

    borrarSyncActasCopasst(acta: Acta) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('DELETE FROM cop_acta_sync_v2 WHERE hashId = ?', [acta['hashId']]).then((resultset) => {
                resolve(this.toResolveObject(resultset));
            });
        });
    }

    //********* OBSERVACION ES********** */

    guardarSyncObservacion(obser: Observacion) {
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO auc_observacion_sync_v2(hashId, body, empresa_id) VALUES (?, ?, ?)';
            this.database.executeSql(sql, [obser['hashId'], JSON.stringify(obser), this.getEmpresa().id]).then(() => resolve());
        });
    }

    getSyncObservaciones() {
        return new Promise((resolve, reject) => {
            this.database.executeSql('SELECT body FROM auc_observacion_sync_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).then((resultset) => {
                resolve(this.toResolveObject(resultset));
            });
        });
    }

    borrarSyncObservacion(obser: Observacion) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('DELETE FROM auc_observacion_sync_v2 WHERE hashId = ?', [obser['hashId']]).then((resultset) => {
                resolve(this.toResolveObject(resultset));
            });
        });
    }

    //********* CAUSA RAIZ ********** */

    getSistemaCausaRaiz() {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM sec_sistema_causa_raiz_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset)['data'][0]);
                })
                .catch((err) => reject(err));
        });
    }

    setSistemaCausaRaiz(sistemaCausaRaiz: SistemaCausaRaiz[]) {
        return new Promise((resolve, reject) => {
            sistemaCausaRaiz.forEach((scr) => {
                let sql = 'INSERT INTO sec_sistema_causa_raiz_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [scr.id, JSON.stringify(scr), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    borrarSistemaCausaRaiz() {
        this.database.executeSql('DELETE FROM sec_sistema_causa_raiz_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }
    //********* AREAS ********** */

    getAreas() {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM emp_area_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    setAreas(areas: Area[]) {
        return new Promise((resolve, reject) => {
            areas.forEach((area) => {
                let sql = 'INSERT INTO emp_area_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [area.id, JSON.stringify(area), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    borrarAreas() {
        this.database.executeSql('DELETE FROM emp_area_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }

    //********* TARJETAS ********** */

    getTarjetas() {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM auc_tarjeta_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset)['data']);
                })
                .catch((err) => reject(err));
        });
    }

    setTarjetas(desviaciones: Desviacion[]) {
        return new Promise((resolve, reject) => {
            desviaciones.forEach((desv) => {
                let sql = 'INSERT INTO auc_tarjeta_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [desv.hashId, JSON.stringify(desv), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    borrarTarjetas() {
        this.database.executeSql('DELETE FROM auc_tarjeta_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }

    //********* NIVEL RIESGO ********** */

    getSistemaNivelRiesgo() {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM sec_sistema_nivel_riesgo_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    setSistemaNivelRiesgo(sistemaNR: SistemaNivelRiesgo[]) {
        return new Promise((resolve, reject) => {
            sistemaNR.forEach((snr) => {
                let sql = 'INSERT INTO sec_sistema_nivel_riesgo_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [snr.id, JSON.stringify(snr), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    borrarSistemaNivelRiesgo() {
        this.database.executeSql('DELETE FROM sec_sistema_nivel_riesgo_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }

    //********* PROGRAMACIONES ********** */

    getProgramaciones() {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM inp_programacion_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    setProgramaciones(programaciones: Programacion[]) {
        return new Promise((resolve, reject) => {
            programaciones.forEach((prog) => {
                let sql = 'INSERT INTO inp_programacion_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [prog.id, JSON.stringify(prog), this.getEmpresa().id]);
            });
            resolve();
        });
    }
    updateProgramacion(programacion: Programacion) {
        return new Promise((resolve, reject) => {
            this.database.executeSql('UPDATE inp_programacion_v2 SET body = ? WHERE id = ?', [JSON.stringify(programacion), programacion.id]).then(() => {
                resolve();
            });
        });
    }

    borrarProgramaciones() {
        this.database.executeSql('IF EXISTS (DELETE FROM inp_programacion_v2 WHERE empresa_id = ?)', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }
    //********* SISTEMA CAUSA ADMIN ********** */

    getSistemaCausaAdministrativa() {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM sec_sistema_causa_administrativa_v2 WHERE empresa_id = ? LIMIT 1', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset)['data'][0]);
                })
                .catch((err) => reject(err));
        });
    }

    setSistemaCausaAdministrativa(sistemaCA: SistemaNivelRiesgo[]) {
        return new Promise((resolve, reject) => {
            sistemaCA.forEach((sca) => {
                let sql = 'INSERT INTO sec_sistema_causa_administrativa_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [sca.id, JSON.stringify(sca), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    borrarSistemaCausaAdministrativa() {
        this.database.executeSql('DELETE FROM sec_sistema_causa_administrativa_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }

    //********** ANALISIS DESVIACIONES ******************** */
    guardarAnalisisDesviacion(analisis: AnalisisDesviacion): any {
        return new Promise((resolve, reject) => {
            this.getAnalisisDesviacion(analisis.id).then((resp) => {
                if (resp.count > 0) {
                    let sql = 'UPDATE sec_analisis_desviacion_v2 SET body = ? WHERE id = ?';
                    this.database
                        .executeSql(sql, [JSON.stringify(analisis), analisis.id])
                        .then(() => resolve())
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    let sql = 'INSERT INTO sec_analisis_desviacion_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                    this.database
                        .executeSql(sql, [analisis.id, JSON.stringify(analisis), this.getEmpresa().id])
                        .then(() => resolve())
                        .catch((err) => reject(err));
                }
            });
        });
    }

    getAnalisisDesviacion(id: string): Promise<Response<AnalisisDesviacion[]>> {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT body FROM sec_analisis_desviacion_v2 WHERE id = ?';
            this.database
                .executeSql(sql, [id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    guardarAnalisisSync(analisis: AnalisisDesviacion): any {
        return new Promise((resolve, reject) => {
            this.getAnalisisSync(analisis['hashId']).then((resp) => {
                if (resp.count > 0) {
                    let sql = 'UPDATE sec_analisis_desv_sync_v2 SET body = ? WHERE hashId = ?';
                    this.database
                        .executeSql(sql, [JSON.stringify(analisis), analisis['hash']])
                        .then(() => resolve())
                        .catch((err) => reject(err));
                } else {
                    let sql = 'INSERT INTO sec_analisis_desv_sync_v2(hashid, body, empresa_id) VALUES (?, ?, ?)';
                    this.database
                        .executeSql(sql, [analisis['hash'], JSON.stringify(analisis), this.getEmpresa().id])
                        .then(() => resolve())
                        .catch((err) => reject(err));
                }
            });
        });
    }

    getAnalisisSync(hashId: string): Promise<Response<AnalisisDesviacion[]>> {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT body FROM sec_analisis_desv_sync_v2 WHERE hashId = ? AND empresa_id = ?';
            this.database
                .executeSql(sql, [hashId, this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    getAnalisisListSync(): Promise<Response<AnalisisDesviacion[]>> {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT body FROM sec_analisis_desv_sync_v2 WHERE empresa_id = ?';
            this.database
                .executeSql(sql, [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    borrarAnalisis(hashId: string): any {
        return this.database.executeSql('DELETE FROM sec_analisis_desv_sync_v2 WHERE hashId = ?', [hashId]).catch((err) => {
            console.log(err);
        });
    }

    //**********  MANUALES **************** */

    setManualesUsuario(manuales: Manual[]) {
        return new Promise((resolve, reject) => {
            manuales.forEach((man) => {
                let sql = 'INSERT INTO conf_manual_usuario_v2(id, body, empresa_id) VALUES (?, ?, ?)';
                this.database.executeSql(sql, [man.id, JSON.stringify(man), this.getEmpresa().id]);
            });
            resolve();
        });
    }

    getManualesUsuario(): any {
        return new Promise((resolve, reject) => {
            this.database
                .executeSql('SELECT body FROM conf_manual_usuario_v2 WHERE empresa_id = ?', [this.getEmpresa().id])
                .then((resultset) => {
                    resolve(this.toResolveObject(resultset));
                })
                .catch((err) => reject(err));
        });
    }

    borrarManualesUsuario() {
        this.database.executeSql('DELETE FROM conf_manual_usuario_v2 WHERE empresa_id = ?', [this.getEmpresa().id]).catch((err) => {
            console.log(err);
        });
    }

    //********* UTIL ********** */
    toResolveObject(resultset: any) {
        let listas = [];
        for (let index = 0; index < resultset.rows.length; index++) {
            listas.push(JSON.parse(resultset.rows.item(index)['body']));
        }
        return { count: listas.length, data: listas };
    }
}

interface Response<T> {
    count: number;
    data: T;
}
