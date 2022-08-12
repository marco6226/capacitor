import { Recurso } from './recurso'
import { Perfil } from './perfil'

export class Permiso {
  id: string;
  valido: boolean;
  recurso: Recurso;
  perfil: Perfil;
  areas: string;
}