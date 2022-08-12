
import { Formulario } from './formulario';
import { RespuestaCampo } from './respuesta-campo';

export class Campo {
  id: string;
  nombre: string;
  descripcion: string;
  requerido: string;
  tipo: string;
  opciones: string[];
  formulario: Formulario;
  respuestaCampo: RespuestaCampo;
}