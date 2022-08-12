import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ComunModule } from '../../../com/comun.module'
import { IonicModule } from '@ionic/angular';
import { MisTareasPage } from './mis-tareas.page';
import { TareaEvidencesComponent } from '../../components/tarea-evidences/tarea-evidences.component';
import { TareaModule } from '../../components/tarea/tarea.module';
import { TareaPageModule } from '../tarea/tarea.module';


const routes: Routes = [
  {
    path: '',
    component: MisTareasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TareaPageModule
  ],
  exports: [],
  providers: [],
  entryComponents: [
    // TareaComponent, 
    // TareaModule, 
    // TareaGeneralComponent, 
    // TareaCierreComponent,
    // TareaSeguimientoComponent,
    // TareaEvidencesComponent
  ],
  declarations: [
    MisTareasPage,
    // TareaComponent,
    // TareaPage,
    // TareaGeneralComponent,
    // TareaCierreComponent,
    // TareaSeguimientoComponent,
    TareaEvidencesComponent
  ],
})
export class MisTareasPageModule {

}
