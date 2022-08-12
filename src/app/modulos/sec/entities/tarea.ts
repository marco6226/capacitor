import { Area } from '../../emp/entities/area';
import { Empleado } from '../../emp/entities/empleado';

// import { AnalisisDesviacion } from 'app/modulos/sec/entities/analisis-desviacion'
// import { Area } from 'app/modulos/empresa/entities/area'
// import { Usuario } from 'app/modulos/empresa/entities/usuario'

export class Tarea {
    id: string;
    nombre: string;
    descripcion: string;
    tipoAccion: string;
    jerarquia: string;
    estado: string;
    fechaProyectada: Date;
    fechaRealizacion: Date;
    fechaVerificacion: Date;
    empResponsable: Empleado;
    areaResponsable: Area;
    observacionesRealizacion: string;
    observacionesVerificacion: string;
    fecha_proyectada: Date;
    // usuarioRealiza: Usuario;
    // usuarioVerifica: Usuario;
    // analisisDesviacionList: AnalisisDesviacion[];
}
