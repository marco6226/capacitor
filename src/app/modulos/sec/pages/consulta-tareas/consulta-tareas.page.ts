import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../../../com/services/sesion.service';
import { FilterQuery } from '../../../com/entities/filter-query';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../entities/tarea';
import { Criteria } from '../../../com/entities/filter';
import { AlertController } from '@ionic/angular';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { ReporteObservacionPage } from '../../../auc/pages/reporte-observacion/reporte-observacion.page';

@Component({
  selector: 'sm-consultaTareas',
  templateUrl: './consulta-tareas.page.html',
  styleUrls: ['./consulta-tareas.page.scss'],
  providers: [TareaService]
})
export class ConsultaTareasPage implements OnInit {

  loading: boolean = true;
  tareasList: Tarea[];

  constructor(
    private msgService: MensajeUsuarioService,
    private alertController: AlertController,
    private tareaService: TareaService,
    private sesionService: SesionService,
    private router: Router
  ) { }

  ngOnInit() {
    let areas: string = this.sesionService.getPermisosMap()['SEC_GET_TAR'].areas;
    let fq = new FilterQuery();
    fq.fieldList = [
      'id', 'nombre', 'descripcion', 'observacionesRealizacion', 'tipoAccion', 'usuarioRealiza_id',
      'estado', 'fechaProyectada', 'fechaRealizacion', 'usuarioRealiza_email', 'areaResponsable_id',
      'areaResponsable_nombre', 'areaResponsable_tipoArea_nombre'
    ]
    fq.filterList = [
      { field: 'areaResponsable.id', value1: areas, criteria: Criteria.CONTAINS },
      { field: 'estado', value1: 'FINALIZADA', criteria: Criteria.NOT_EQUALS }
    ];

    this.tareaService.findByFilter(fq)
      .then(resp => {
        this.tareasList = [];
        (resp['data']).forEach(tarea => {
          let obj = FilterQuery.dtoToObject(tarea);
          this.tareasList.push(obj);
        });
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  navegar(url) {
    this.router.navigate([url]);
  }

  abrirDlg(tarea: Tarea, idx: number, repCump: boolean) {
    // this.confirmarTarea(tarea, idx, repCump);
    this.reportar(tarea, repCump, idx);
  }

  // async confirmarTarea(tarea: Tarea, idx: number, repCump: boolean) {
  //   let accion = repCump ? 'cumplimiento' : 'verificación';
  //   let alert = await this.alertController.create({
  //     subHeader: 'Reporte de ' + accion + ':',
  //     message: tarea.nombre,
  //     inputs: [
  //       { name: 'descripcion', type: 'text', placeholder: 'Observaciones de ' + accion }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Reportar',
  //         handler: data => this.reportar(tarea, repCump, idx, data.descripcion)
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //         }
  //       }
  //     ]
  //   }).;
  //   await alert.present();
  // }

  reportar(tarea: Tarea, repCump: boolean, idx: number): any {
    tarea['loading'] = true;
    if (repCump == true) {
      this.tareaService.reportarCumplimiento(tarea)
        .then((resp: Tarea) => {
          this.tareasList[idx] = resp;
          this.msgService.showMessage({
            mensaje: 'Reporte realizado',
            detalle: 'El cumplimiento de la tarea fue reportado correctamente',
            tipoMensaje: 'success'
          });
          tarea['loading'] = false;
        })
        .catch(err => {
          tarea['loading'] = false;
        });
    } else {
      this.tareaService.reportarVerificacion(tarea)
        .then((resp: Tarea) => {
          this.tareasList[idx] = resp;
          this.msgService.showMessage({
            mensaje: 'Reporte realizado',
            detalle: 'La verificación de la tarea fue reportada correctamente',
            tipoMensaje: 'success'
          });
          tarea['loading'] = false;
        })
        .catch(err => {
          tarea['loading'] = false;
        });;
    }
  }


}
