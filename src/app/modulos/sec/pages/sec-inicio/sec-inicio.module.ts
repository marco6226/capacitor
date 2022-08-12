
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SecInicioPage } from './sec-inicio.page';
import { ComunModule } from '../../../com/comun.module';

const routes: Routes = [
    {
        path: '',
        component: SecInicioPage
    }
];


@NgModule({
    imports: [
        CommonModule,
        ComunModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        ComunModule,
    ],
    providers: [],
    entryComponents: [],
    declarations: [
        SecInicioPage
    ]

})
export class SecInicioPageModule {

}
