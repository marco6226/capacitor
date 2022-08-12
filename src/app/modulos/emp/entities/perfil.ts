import { Permiso } from './permiso'

export class Perfil {
  id: string;
  nombre: string;
  descripcion: string;
  permisoList: Permiso[];
}