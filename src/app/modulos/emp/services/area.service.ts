import { Injectable } from '@angular/core';

import { ServiceCRUD } from '../../com/services/service-crud.service'
import { Area } from '../entities/area'

@Injectable()
export class AreaService extends ServiceCRUD<Area> {

  getClassName() : string{
    return "AreaService";
  }

}
