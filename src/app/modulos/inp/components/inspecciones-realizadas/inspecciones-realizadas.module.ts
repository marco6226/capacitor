import { ComunModule } from './../../../com/comun.module';
import { FiltroModule } from './filtro/filtro.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspeccionConsultarFormComponent } from '../inspeccion-consultar-form/inspeccion-consultar-form.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { TareaSeguimientoComponent } from '../../../sec/components/tarea-seguimiento/tarea-seguimiento.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule, 
        FormsModule, 
        IonicModule, 
        // FiltroModule
        ComunModule
    ],
    entryComponents: [],
})
export class InspeccionesRealizadasModule {}
