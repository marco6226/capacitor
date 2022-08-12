
import { NivelRiesgo } from './nivel-riesgo'
import { Consecuencia } from './consecuencia'
import { Probabilidad } from './probabilidad'

export class SistemaNivelRiesgo {
  id: string;
  nombre: string;
  descripcion: string;
  nivelRiesgoList: NivelRiesgo[];
  consecuenciaList: Consecuencia[];
  probabilidadList: Probabilidad[];
}
