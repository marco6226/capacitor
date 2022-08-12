import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modulos/com/components/login/login.component';
import { InicioComponent } from './modulos/com/components/inicio/inicio.component';
import { MisTareasPageModule } from './modulos/sec/pages/mis-tareas/mis-tareas.module';
import { MisTareasPage } from './modulos/sec/pages/mis-tareas/mis-tareas.page';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'appUpdate', loadChildren: () => import('./modulos/com/pages/app-update/app-update.module').then(m => m.AppUpdatePageModule) },
  { path: 'login', component: LoginComponent, },
  {
    path: 'app',
    component: InicioComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'ayuda',
        loadChildren: () =>import('./ayuda/ayuda.module').then(m => m.AyudaPageModule)
      },
      {
        path: 'inp/elaboracionInspeccion',
        loadChildren:() =>import( './modulos/inp/pages/elaboracion-inspeccion/elaboracion-inspeccion.module').then(m => m.ElaboracionInspeccionPageModule)
      },
      {
        path: 'auc/reporteObservacion',
        loadChildren: () =>import('./modulos/auc/pages/reporte-observacion/reporte-observacion.module').then(m => m.ReporteObservacionPageModule)
      },
      {
        path: 'cop/consultaActas',
        loadChildren: () =>import('./modulos/cop/pages/consulta-actas/consulta-actas.module').then(m => m.ConsultaActasPageModule)
      },
      {
        path: 'sec/consultaTareas',
        loadChildren: () =>import('./modulos/sec/pages/consulta-tareas/consulta-tareas.module').then(m => m.ConsultaTareasPageModule)
      },
      // {
      //   path: 'sec/misTareas',
      //   loadChildren: './modulos/sec/pages/mis-tareas/mis-tareas.module#MisTareasPageModule'
      // },
      {
        path: 'sec',
        children:[
          {path:'misTareas', component: MisTareasPage},
          {path:'misTareas/:id', component: MisTareasPage}
        ]
      },
      {
        path: 'sec/secInicio',
        loadChildren: () =>import('./modulos/sec/pages/sec-inicio/sec-inicio.module').then(m => m.SecInicioPageModule)
      },
      {
        path: 'sec/consultaDesviaciones',
        loadChildren:() =>import( './modulos/sec/pages/consulta-desviaciones/consulta-desviaciones.module').then(m => m.ConsultaDesviacionesPageModule)
      },
      {
        path: 'ind/consultaTablero',
        loadChildren: () =>import('./modulos/ind/pages/consulta-tablero/consulta-tablero.module').then(m => m.ConsultaTableroPageModule)
      }
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
