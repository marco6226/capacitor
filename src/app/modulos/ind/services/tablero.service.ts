import { Injectable } from '@angular/core';

import { Tablero } from '../entities/tablero';
import { ServiceCRUD } from '../../com/services/service-crud.service';

@Injectable()
export class TableroService extends ServiceCRUD<Tablero>{

    getClassName() {
        return "TableroService";
    }

}
