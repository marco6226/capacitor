import { Kpi } from "./kpi";


export interface Tablero {
    id: string;
    nombre: string;
    descripcion: string;
    plantilla: string;
    kpis:string;
    kpisObj:Kpi[];
}