import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroPipeInspecciones, FiltroPipeInspeccionesLista, FiltroPipeInspeccionesListaProg } from './filtro.pipe';



@NgModule({
  declarations: [
    FiltroPipeInspecciones,
    FiltroPipeInspeccionesLista,
    FiltroPipeInspeccionesListaProg
  ],
  imports: [
    // CommonModule
  ],
  exports:[
    FiltroPipeInspecciones,
    FiltroPipeInspeccionesLista,
    FiltroPipeInspeccionesListaProg
  ],
  entryComponents:[
    // FiltroPipe
  ]
})
export class FiltroModule { }
