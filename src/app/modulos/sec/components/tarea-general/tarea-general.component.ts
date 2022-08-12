import { DomSanitizer } from '@angular/platform-browser';
import { DirectorioService } from './../../../ado/services/directorio.service';
import { TareaService } from './../../services/tarea.service';
import { Tarea } from './../../entities/tarea';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';


@Component({
  selector: 'app-tarea-general',
  templateUrl: './tarea-general.component.html',
  styleUrls: ['./tarea-general.component.scss'],
  providers: [TareaService]
})
export class TareaGeneralComponent implements OnInit {
  tarea: Tarea;
  datosTarea;
  tareaEvidences = [];
  imagenesList: any = [];
  //tareaServices: TareaService;
  constructor(
    private modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
    private tareaServices: TareaService,
    private directorioService: DirectorioService,
    private domSanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    this.leerTareaSeleccionada();
   
  }

  async leerTareaSeleccionada(){
    await this.modalController.getTop()
    .then(data => {     
        this.tarea = (<any>data).componentProps.value;          
    }); 
    //console.log(this.tarea)
    this.datosTarea= this.tarea;
    this.getTareaEvidences();
  }

  async getTareaEvidences() {
    try {
      //console.log(this.datosTarea.hash_id.slice(0, 3));
    let res: any = await this.tareaServices.getTareaEvidencesModulos(
        this.datosTarea.id,
        this.datosTarea.hash_id.slice(0, 3)
    );

    if (res) {
        res.files.forEach(async (evidence) => {
            await this.directorioService.download(evidence).then((data)=>{
              let urlData = this.domSanitizer.bypassSecurityTrustUrl(
                URL.createObjectURL(<any>data)
            );
            this.imagenesList.push({ source: Object.values(urlData) });
            this.imagenesList = this.imagenesList.slice();
            });
        });
    }
    } catch (error) {
      //console.log("error")
    }
    
  }

}
