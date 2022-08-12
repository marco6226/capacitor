import { TareaGeneralComponent } from './../../components/tarea-general/tarea-general.component';
import { ComunModule } from './../../../com/comun.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TareaPage } from './tarea.page';

const routes: Routes = [
  {
    path: '',
    component: TareaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),ComunModule],
  exports: [RouterModule,],
  declarations:[],
  entryComponents:[]
})
export class TareaPageRoutingModule {}
