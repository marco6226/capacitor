import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service'
import { Tarjeta } from '../entities/tarjeta';

@Injectable()
export class TarjetaService extends ServiceCRUD<Tarjeta>{

  getClassName(): string {
    return "TarjetaService";
  }
}
