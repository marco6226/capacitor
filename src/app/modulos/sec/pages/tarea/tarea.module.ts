import { TareaSeguimientoComponent } from './../../components/tarea-seguimiento/tarea-seguimiento.component';
import { TareaCierreComponent } from './../../components/tarea-cierre/tarea-cierre.component';
import { TareaGeneralComponent } from './../../components/tarea-general/tarea-general.component';
import { ComunModule } from './../../../com/comun.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TareaPageRoutingModule } from './tarea-routing.module';

import { TareaPage } from './tarea.page';
import { SafeBypassPipe } from '../../../com/pipes/safe-bypass.pipe';
import { MisTareasPageModule } from '../mis-tareas/mis-tareas.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // SafeBypassPipe,
    // MisTareasPageModule
    // ComunModule
    ComunModule
  ],
  exports:[
    // SafeBypassPipe
  ],
  declarations: [
    TareaPage,
    // TareaCierreComponent, 
    // SafeBypassPipe, 
    TareaGeneralComponent, 
    TareaSeguimientoComponent,
    TareaCierreComponent
  ],
  entryComponents: [
    TareaPage
    // SafeBypassPipe,
  ],
})
export class TareaPageModule {}
