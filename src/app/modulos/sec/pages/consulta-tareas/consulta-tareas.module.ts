import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ComunModule } from '../../../com/comun.module'
import { IonicModule } from '@ionic/angular';
import { ConsultaTareasPage } from './consulta-tareas.page';


const routes: Routes = [
  {
    path: '',
    component: ConsultaTareasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [ComunModule],
  providers: [],
  entryComponents: [],
  declarations: [
    ConsultaTareasPage
  ]
})
export class ConsultaTareasPageModule {

}
