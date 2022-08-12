import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConsultaActasPage } from './consulta-actas.page';
import { ActaFormComponent } from '../../components/acta-form/acta-form.component'
import { AreaSelectorModule } from '../../../com/components/area-selector/area-selector.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaActasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AreaSelectorModule
  ],
  exports: [],
  entryComponents: [ActaFormComponent],
  declarations: [ConsultaActasPage, ActaFormComponent]
})
export class ConsultaActasPageModule { }
