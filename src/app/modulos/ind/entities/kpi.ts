import { ModeloGrafica } from "./modelo-grafica";


export interface Kpi {
    tableroId?: string;
    modelo?: KpiModel;
}

export interface KpiModel {
    obj_id: string;
    titulo: string;
    dataChart: ModeloGrafica;
    resumen: boolean;
    options: any;
    type: string;
    chartType: string;
    parametros: ParametroIndicador;
    hideChart: boolean;
}


export interface ParametroIndicador {
    indicadorId: string,
    param: Parametro
}

interface Parametro {
    empresa_id: string,
    crossdata: boolean,
    area_id: string,
    rangos: RangoFechas[],
    //
    baremos: Baremo[];
    areas: string[];
    rangoUnico: boolean;
}

interface Baremo {
    min: number;
    max: number;
    color: string;
    backgroundColor: string;
}

export class RangoFechas {
    desde: Date;
    hasta: Date;
    nombre: string;
}