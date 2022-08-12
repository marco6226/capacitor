
import { Calificacion } from './calificacion'
import { TipoHallazgo } from './tipo-hallazgo'

export class ElementoInspeccion {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    elementoInspeccionPadre: ElementoInspeccion;
    elementoInspeccionList: ElementoInspeccion[] = [];
    calificable: boolean;
    numero: number;
    calificacion: Calificacion;
    tipoHallazgoList: TipoHallazgo[];
    criticidad:string;
}