
export interface ModeloGrafica {
    title: string;
    labels: string[];
    datasets: Dataset[];
    lat?: number[];
    long?: number[];
    fichaTecnicaIndicador: FichaTecnicaIndicador;
}

export interface Dataset {
    data: number[];
    label: string;
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
    //
    posicionUnidad: string;
    unidad: string;
    dataStyle: DataStyle[];
}

export interface DataStyle {
    backgroundColor: string;
    color: string;
}

export interface FichaTecnicaIndicador {
    proceso: string;
    nombre: string;
    descripcion: string;
    formulación: string;
    frecuenciaSeguimiento: string;
    meta: string;
}
