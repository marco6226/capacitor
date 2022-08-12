import { Area } from "../../emp/entities/area";
import { Documento } from "../../ado/entities/documento";


export class Acta {
    id: string;
    nombre: string;
    descripcion: string;
    fechaElaboracion: Date;
    area: Area;
    documentosList: Documento[];
}