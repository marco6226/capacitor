import { TareaEvidencesComponent } from './../tarea-evidences/tarea-evidences.component';
import { SeguimientosService } from './../../services/seguimientos.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Tarea } from '../../entities/tarea';
import { TareaCierreComponent } from '../tarea-cierre/tarea-cierre.component';

@Component({
  selector: 'app-tarea-seguimiento',
  templateUrl: './tarea-seguimiento.component.html',
  styleUrls: ['./tarea-seguimiento.component.scss'],
})
export class TareaSeguimientoComponent implements OnInit {
  
  trackings;
  tarea: Tarea;
  datosTarea;
  @Input() value;
  @Input() Estado;
  @Output() isFollowExist: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private seguimientoService: SeguimientosService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.leerTareaSeleccionada();
    //console.log(this.Estado)
  }

  async leerTareaSeleccionada(){
    await this.modalController.getTop()
    .then(data => {     
        this.tarea = (<any>data).componentProps.value;          
    }); 
    //console.log(this.tarea)
    this.datosTarea= this.tarea;
    //console.log(this.datosTarea.id);
    this.getSeg();
  }

  public async getSeg() {
    try {
        this.trackings = await this.seguimientoService.getSegByTareaID(this.datosTarea.id);
      // console.log("--------<>",this.trackings)
        if (this.trackings.length > 0) {
            this.isFollowExist.emit(true);
        }        
    } catch (e) {
        this.trackings = null;
        console.log("Error")
      }
  }

  async viewEvidence(idEvi:number){
    ////console.log(this.trackings);
    const modal = await this.modalController.create({
      component: TareaEvidencesComponent,
      componentProps: { value: this.trackings, id: idEvi},
      cssClass: "select-modal",
      /* backdropDismiss: true */
    });
    modal.onDidDismiss().then(
      resp => this.onModalDismiss()
    );
    return await modal.present();

  }
  async onModalDismiss() {
    this.getSeg();
  }

  async agregarSeguimiento(){
    console.log(this.value, this.Estado)
    const modal = await this.modalController.create({
      component: TareaCierreComponent,
      //component: TareaComponent,
      componentProps: { value: this.value, Estado: this.Estado, IsSeguimiento: true },
      // cssClass: "modal-peq"
      cssClass: "modal-fullscreen"
    });
    modal.onDidDismiss().then(
      resp => this.onModalDismiss()
    );
    return await modal.present();
  }

}
