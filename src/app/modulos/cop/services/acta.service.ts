import { Injectable } from '@angular/core';
import { ServiceCRUD } from './../../com/services/service-crud.service';
import { Acta } from '../entities/acta';
import { ArchivoLocal } from '../pages/consulta-actas/consulta-actas.page';
import { Util } from '../../com/utils/util';
import { DirectorioService } from '../../ado/services/directorio.service';
import { MensajeUsuarioService } from '../../com/services/mensaje-usuario.service';
import { HttpInt } from '../../com/services/http-int.service';
import { Directorio } from '../../ado/entities/directorio';
import { Router } from '@angular/router';

@Injectable()
export class ActaService extends ServiceCRUD<Acta>{

    constructor(
        public router: Router,
        public dirService: DirectorioService,
        public httpInt: HttpInt,
        public mensajeUsuarioService: MensajeUsuarioService
    ) {
        super(router, httpInt, mensajeUsuarioService);
    }

    subirActa(acta: Acta, archList: ArchivoLocal[]) {
        return new Promise((resolve, reject) => {
            this.create(acta)
                .then((resp:Acta) => {
                    acta.id = resp.id;
                    acta.fechaElaboracion = resp.fechaElaboracion;
                    if (archList != null) {
                        let count = 0;
                        archList.forEach(arch => {
                            Util.dataURLtoFile(arch.url, arch.alias + "." + arch.ext)
                                .then(file => {
                                    this.dirService.upload(file, null, 'cop', acta.id, false)
                                        .then((dir: Directorio) => {
                                            if (acta.documentosList == null) {
                                                acta.documentosList = []
                                            }
                                            acta.documentosList.push(dir.documento);
                                            count += 1;
                                            if (count == archList.length) {
                                                resolve(acta);
                                            }
                                        })
                                        .catch(err => {
                                            count += 1;
                                            if (count == archList.length) {
                                                resolve(acta);
                                            }
                                        });
                                });
                        });
                    } else {
                        resolve(acta);
                    }
                }).catch(err => {
                    reject(err);
                    this.manageError(err);
                });
        });
    }

    getClassName() {
        return 'ActaService';
    }
}
