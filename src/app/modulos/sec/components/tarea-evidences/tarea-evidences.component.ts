import { SeguimientosService } from './../../services/seguimientos.service';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DirectorioService } from '../../../ado/services/directorio.service';

@Component({
  selector: 'app-tarea-evidences',
  templateUrl: './tarea-evidences.component.html',
  styleUrls: ['./tarea-evidences.component.scss'],
})
export class TareaEvidencesComponent implements OnInit {

  @Input() value;
  @Input() id;
  evidences;
  img:any;
  imgURL: any;
  mimeType = {
    'U': {
        head: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ext: 'xlsx',
    },
    'J': {
        head: 'application/pdf',
        ext: 'pdf'
    },
    '/': {
        head: 'image/jpeg',
        ext: 'jpeg'
    },
    'i': {
        head: 'image/png',
        ext: 'png'
    }
}

  constructor(
    private modalController: ModalController,
    private seguimientoService: SeguimientosService,
  ) { }

  ngOnInit() {
    console.log(this.value,"ok",this.id);  
    this.getEvidences(this.id);  
  }

  navegar() {
    this.modalController.dismiss();
  }

  async getEvidences(id) {

    try {
      console.log("1")
      this.evidences = await this.seguimientoService.getEvidences(id, "fkSegId");

      console.log("2",this.evidences.files);

      console.log(this.evidences);

    } catch (e) {
        console.log(e);
    }
  }

  convertImg(img){
    this.img = img;
    if (this.img) {
            
      if (this.img.split(',').length > 1) this.img = this.img.split(',')[1];

      let type = this.mimeType[this.img.charAt(0)];

      if (type.ext !== 'png' && type.ext !== 'jpeg') return this.imgURL = '../../../../../assets/images/file.png';
      this.imgURL = 'data:image/png;base64,' + this.img;
      /* console.log(this.imgURL) */
      return this.imgURL;
    }
  }
  
}
