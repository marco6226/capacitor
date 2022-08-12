import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { ElementoInspeccion } from '../../entities/elemento-inspeccion';
import { PopoverController, NavParams, AlertController } from '@ionic/angular';
import { Inspeccion } from '../../entities/inspeccion';
import { StorageService } from '../../../com/services/storage.service';


@Component({
  selector: 'sm-inspeccionPendiente',
  templateUrl: './inspeccion-pendiente.component.html',
  styleUrls: ['./inspeccion-pendiente.component.scss']
})
export class InspeccionPendienteComponent implements OnInit {

  inspeccionesList: Inspeccion[];
  contador: number = 0;
  datosGene: string;

  constructor(
    public alertController: AlertController,
    private storageService: StorageService,
    private navParams: NavParams,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.inspeccionesList = <Inspeccion[]>(this.navParams.data.inspecciones);
  }

  seleccionar(insp: Inspeccion) {
    this.popoverController.dismiss(insp);
  }

  async elimianrInsp(insp: Inspeccion, idx: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar acción',
      message: 'Esto borrará permanentemente la inspección que habia inciado ¿Confirma esta acción?',
      buttons: [{
        text: 'Si',
        handler: () => {
          this.storageService.borrarInspeccionPendiente(insp);
          this.inspeccionesList.splice(idx, 1);
          if (this.inspeccionesList.length == 0)
            this.popoverController.dismiss();
        }
      },
      {
        text: 'No',
        role: 'cancel'
      }]
    });
    await alert.present();


  }
}
