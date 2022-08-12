import { Injectable } from '@angular/core';
import { ServiceCRUD } from '../../com/services/service-crud.service'
import { Programacion } from '../entities/programacion'

@Injectable()
export class ProgramacionService extends ServiceCRUD<Programacion>{

  getClassName(): string {
    return "ProgramacionService";
  }


}