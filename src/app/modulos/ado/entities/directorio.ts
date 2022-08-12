
import { Usuario } from '../../emp/entities/usuario'
import { Documento } from '../entities/documento'


export class Directorio {
  id: string;
  nombre: string;
  esDocumento: boolean;
  usuario: Usuario;
  directorioList: Directorio[];
  directorioPadre: Directorio;
  documento: Documento;
  tamanio: number;
  fechaCreacion: Date;
}