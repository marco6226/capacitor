import { ObservacionConsultarFormComponent } from './../../components/observacion-consultar-form/observacion-consultar-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReporteObservacionPage } from './reporte-observacion.page';
import { ObservacionFormComponent } from '../../components/observacion-form/observacion-form.component';
import { TreeModule } from '../../../com/components/tree/tree.component';
import { ComunModule } from '../../../com/comun.module';
import { ObservacionSyncComponent } from '../../components/observaciones-sync/observacion-sync.component';
import { AreaSelectorModule } from '../../../com/components/area-selector/area-selector.component';
import { ObservacionEditarComponent } from '../../components/observacion-editar/observacion-editar.component';

const routes: Routes = [
    {
        path: '',
        component: ReporteObservacionPage,
    },
];

@NgModule({
    imports: [ComunModule, CommonModule, FormsModule, ReactiveFormsModule, IonicModule, TreeModule, RouterModule.forChild(routes), AreaSelectorModule],
    exports: [ComunModule],
    entryComponents: [ObservacionFormComponent,ObservacionConsultarFormComponent,ObservacionEditarComponent],
    declarations: [ReporteObservacionPage, ObservacionFormComponent, ObservacionSyncComponent, ObservacionConsultarFormComponent,ObservacionEditarComponent],
})
export class ReporteObservacionPageModule {}
