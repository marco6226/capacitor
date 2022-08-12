import { CausaRaiz } from "./causa-raiz";
import { Desviacion } from "./desviacion";
import { CausaInmediata } from './causa-inmediata';
import { Documento } from '../../ado/entities/documento';
import { CausaAdministrativa } from "./sistema-causa-administrativa";
import { Tarea } from "./tarea";
// import { AnalisisCosto } from './analisis-costo';


export class AnalisisDesviacion {
  id: string;
  // analisisCosto:AnalisisCosto;
  observacion: string;
  fechaElaboracion: Date;
  tareaId: string;
  causaRaizList: CausaRaiz[];
  causaInmediataList: CausaInmediata[];
  desviacionesList: Desviacion[];
  documentosList:Documento[];
  tareaDesviacionList:Tarea[];

  participantes:string;
  tareaAsignada:boolean;
  causasAdminList: CausaAdministrativa[];
}
