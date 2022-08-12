import { TareaService } from './../../services/tarea.service';
import { ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
  providers: [TareaService]
})
export class TareaComponent implements OnInit {
  consultar: boolean;
  observacion: any;
  segments = { 'general': true, 'seguimientos':false, 'cierre': false };

  constructor(
    private modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.cargarId();
    
  }

  async cargarId(){
await this.modalController.getTop()
    .then(data => {      
        this.observacion = (<any>data).componentProps.value;     
    }); 
    console.log(this.observacion)
  }

  anterior() {
    this.presentAlertaSalir();
  }

  async presentAlertaSalir() {
    const alert = await this.alertController.create({
      header: '¿Desea salir?',
      message: 'La tarea no ha sido guardada, los datos serán descartados. ¿Confirma esta acción?',
      buttons: [{
        text: 'Si',
        handler: () => {
          this.modalController.dismiss();
        }
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'No'
      }]
    });
    await alert.present();
  }

  segmentChanged(event) {
    for (var seg in this.segments) {
      this.segments[seg] = false;
      if (event.detail.value == seg)
        this.segments[seg] = true;

    }
  }

}
