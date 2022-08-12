import { SistemaNivelRiesgo } from './sistema-nivel-riesgo'

export class Consecuencia {
  id: string;
  nombre: string;
  descripcion: string;
  valor: number;
  sistemaNivelRiesgo: SistemaNivelRiesgo;
}