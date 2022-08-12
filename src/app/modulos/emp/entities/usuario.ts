
//import { UsuarioEmpresa } from 'app/modulos/empresa/entities/usuario-empresa'

export class Usuario {
  id: string;
  email: string;
  perfilesId: string[];
  perfilNombre: string;
  estado: string;
  avatar: string;
  fechaAceptaTerminos: Date;
  //  usuarioEmpresaList: UsuarioEmpresa[];
}
