import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AyudaPage } from './ayuda.page';
import { ComunModule } from '../modulos/com/comun.module';

@NgModule({
  imports: [
    ComunModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AyudaPage
      }
    ])
  ],
  exports:[ComunModule],
  declarations: [AyudaPage]
})
export class AyudaPageModule {}
