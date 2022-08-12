import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ComunModule } from '../../../com/comun.module'
import { IonicModule } from '@ionic/angular';
import { ConsultaTableroPage } from './consulta-tablero.page';
import { PanelGraficaComponent } from '../../components/panel-grafica/panel-grafica.component';
import { OpcionesGraficaComponent } from '../../../com/components/opciones-grafica/opciones-grafica.component'

const routes: Routes = [
  {
    path: '',
    component: ConsultaTableroPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComunModule,
    RouterModule.forChild(routes)
  ],
  exports: [ComunModule],
  providers: [],
  entryComponents: [OpcionesGraficaComponent],
  declarations: [
    ConsultaTableroPage,
    PanelGraficaComponent,
    OpcionesGraficaComponent
  ]
})
export class ConsultaTableroPageModule {

}
