

import { ElementoInspeccion } from './elemento-inspeccion'
import { OpcionCalificacion } from './opcion-calificacion'
import { NivelRiesgo } from '../../com/entities/nivel-riesgo';
import { Documento } from '../../ado/entities/documento'
import { TipoHallazgo } from './tipo-hallazgo';

export class Calificacion {
    id: string;
    recomendacion: string;
    elementoInspeccion: ElementoInspeccion;
    opcionCalificacion: OpcionCalificacion;
    nivelRiesgo: NivelRiesgo;
    tipoHallazgo:TipoHallazgo;
    documentosList: Documento[];
}