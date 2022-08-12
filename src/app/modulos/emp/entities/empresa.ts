
//import { Arl } from 'app/modulos/comun/entities/arl';
//import { Ciiu } from 'app/modulos/comun/entities/ciiu';

export class Empresa {
  id: string;
  nombreComercial: string;
  razonSocial: string;
  nit: string;
  logo:string;
//  arl: Arl;
//  ciiu: Ciiu;

  empresasContratistasList: Empresa[];
}
