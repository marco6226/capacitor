import { Implicacion } from './implicacion';

export class Tarjeta {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    campos: any;
    implicacionList: Implicacion[];
    usarNivelRiesgo: boolean;
    usarCausaRaiz: boolean;
}
