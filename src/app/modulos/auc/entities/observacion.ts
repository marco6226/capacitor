import { Tarjeta } from './tarjeta';
import { Implicacion } from './implicacion';
import { Area } from '../../emp/entities/area';
import { CausaRaiz } from '../../sec/entities/causa-raiz';
import { Usuario } from '../../emp/entities/usuario';
import { Documento } from '../../ado/entities/documento';

export class Observacion {
    id: string;
    tipoObservacion: string;
    afecta: string[];
    descripcion: string;
    recomendacion: string;
    nivelRiesgo: string;
    fechaObservacion: Date;
    aceptada: Boolean;
    motivo: string;
    fechaRespuesta: Date;
    area: Area;
    implicacionList: Implicacion[];
    causaRaizList: CausaRaiz[];
    causaRaizAprobadaList: CausaRaiz[];
    tarjeta: Tarjeta;
    usuarioReporta: Usuario;
    usuarioRevisa: Usuario;
    personasobservadas: string;
    personasabordadas: string;
    documentoList:Documento[];
}
