import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service';
import { TipoHallazgo } from '../entities/tipo-hallazgo';


@Injectable()
export class TipoHallazgoService extends ServiceCRUD<TipoHallazgo>{
  
  getClassName(): string {
    return "TipoHallazgoService";
  }


}
