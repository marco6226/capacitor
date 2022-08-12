
import { ListaInspeccionPK } from './lista-inspeccion-pk'
import { OpcionCalificacion } from './opcion-calificacion'
import { ElementoInspeccion } from './elemento-inspeccion'
import { Formulario } from '../../com/entities/formulario';


export class ListaInspeccion {
  listaInspeccionPK: ListaInspeccionPK = new ListaInspeccionPK();
  nombre: string;
  codigo: string;
  numeroPreguntas: number;
  tipoLista: string;
  descripcion: string;
  elementoInspeccionList: ElementoInspeccion[];
  opcionCalificacionList: OpcionCalificacion[] = [];
  formulario: Formulario;
  usarNivelRiesgo:boolean;
  usarTipoHallazgo:boolean;
}