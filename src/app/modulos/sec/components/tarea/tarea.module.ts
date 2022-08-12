import { ComunModule } from './../../../com/comun.module';
import { TareaComponent } from './tarea.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TareaCierreComponent } from '../tarea-cierre/tarea-cierre.component';

const routes: Routes = [
  {
    path: '',
    component: TareaComponent
  }
];

@NgModule({
  declarations: [TareaComponent,],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    
  ],
  exports: [],
  providers: [],
  entryComponents: []
})
export class TareaModule { }
