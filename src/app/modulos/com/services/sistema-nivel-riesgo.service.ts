import { Injectable } from '@angular/core';
import { ServiceCRUD } from './service-crud.service';
import { SistemaNivelRiesgo } from '../entities/sistema-nivel-riesgo';

@Injectable({
  providedIn: 'root'
})
export class SistemaNivelRiesgoService extends ServiceCRUD<SistemaNivelRiesgo>{

  findDefault() {
    return super.find("default");
  }

  getClassName() {
    return 'SistemaNivelRiesgoService';
  }
}
