import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AppUpdatePage } from './app-update.page';

const routes: Routes = [
  {
    path: '',
    component: AppUpdatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [],
  providers: [],
  entryComponents: [],
  declarations: [
    AppUpdatePage
  ]
})
export class AppUpdatePageModule {

}
