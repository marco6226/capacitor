import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ComunModule } from '../../../com/comun.module'
import { IonicModule } from '@ionic/angular';

import { ConsultaDesviacionesPage } from './consulta-desviaciones.page';
import { InvestigacionDesviacionesComponent } from '../../components/investigacion-desviaciones.component.ts/investigacion-desviaciones.component';
import { TreeModule } from '../../../com/components/tree/tree.component'
import { AnalisisDesviacionesSyncComponent } from '../../components/analisis-desviaciones-sync/analisis-desviaciones-sync.component';
import { FormularioTareasComponent } from '../../components/formulario-tareas/formulario-tareas.component';
import { AreaSelectorModule } from '../../../com/components/area-selector/area-selector.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaDesviacionesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComunModule,
    TreeModule,
    RouterModule.forChild(routes),
    AreaSelectorModule
  ],
  exports: [ComunModule],
  providers: [],
  entryComponents: [InvestigacionDesviacionesComponent],
  declarations: [
    ConsultaDesviacionesPage,
    InvestigacionDesviacionesComponent,
    AnalisisDesviacionesSyncComponent,
    FormularioTareasComponent
  ]
})
export class ConsultaDesviacionesPageModule {

}
