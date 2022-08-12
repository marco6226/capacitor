import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { NivelRiesgo } from '../../../../../com/entities/nivel-riesgo';
import { Calificacion } from '../../../../entities/calificacion';
import { ElementoInspeccion } from '../../../../entities/elemento-inspeccion';
import { Inspeccion } from '../../../../entities/inspeccion';
import { OpcionCalificacion } from '../../../../entities/opcion-calificacion';
import { TipoHallazgo } from '../../../../entities/tipo-hallazgo';
import { InspeccionConsultarFormComponent } from '../../../inspeccion-consultar-form/inspeccion-consultar-form.component';
import { EvidenciasElementoInspeccionComponent } from '../evidencias-elemento-inspeccion/evidencias-elemento-inspeccion.component';

@Component({
  selector: 's-elemento-inspeccion-node',
  templateUrl: './elemento-inspeccion-node.component.html',
  styleUrls: ['./elemento-inspeccion-node.component.scss']
})
export class ElementoInspeccionNodeComponent implements OnInit {
  // files: TreeNode[];

  @Output() onElementoClick = new EventEmitter<any>();
  @Input("value") value: ElementoInspeccion[];
  @Input("opciones") opciones: OpcionCalificacion[];
  @Input() editable: boolean;
  @Input("disabled") disabled: boolean;
  @Input("nivelRiesgoList") nivelRiesgoList: any;
  @Input("diligenciable") diligenciable: boolean;
  @Input("tiposHallazgo") tiposHallazgo:TipoHallazgo[];
  nivel;
  contadorElem = 0;

  @Input() nodeOpts: any = {
    0: { color: 'transparent', contraste: '' },
    1: { color: '#00BFFF', contraste: '' },
    2: { color: '#7B68EE', contraste: '' },
    3: { color: '#20B2AA', contraste: '' },
    4: { color: '#9370DB', contraste: '' },
    5: { color: '#87CEEB', contraste: '' },
    6: { color: '#265C5C', contraste: '' },
    7: { color: '#4169E1', contraste: '' },
    8: { color: '#7B68EE', contraste: '' },
  };

  constructor(private modalController: ModalController) {
  }

  // Interface implements


  ngOnInit() {
    if (this.nivel == null) {
      this.nivel = 0;
    }
    this.nivel += 1;
    if (this.value != null) {
      this.inicializarCalificacion(this.value);
    }
  }

  inicializarCalificacion(elemList: ElementoInspeccion[]) {

    elemList.forEach(element => {
      if (element.calificacion == null) {
        element.calificacion = new Calificacion();
        element.calificacion.opcionCalificacion = new OpcionCalificacion();
        element.calificacion.tipoHallazgo = new TipoHallazgo();
        element.calificacion.nivelRiesgo = new NivelRiesgo();
      } else if (element.calificacion.nivelRiesgo == null) {
        element.calificacion.nivelRiesgo = new NivelRiesgo();
      }
    });
  }

  // Component methods

  emitirEventoSelecElemento(elem: ElementoInspeccion) {
    // this.onElementoClick.emit(elem);
    this.abrirEvidenciaElemento(elem);
  }

  async abrirEvidenciaElemento(elem: ElementoInspeccion) {
    const modal = await this.modalController.create({
        component: EvidenciasElementoInspeccionComponent,
        componentProps: { value: elem },
        cssClass: 'modal-fullscreen',
    });
    return await modal.present();
}

  anterior() {
    // this.presentAlertaSalir();
    this.modalController.dismiss();
  }
}
