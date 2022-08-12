import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { DirectorioService } from '../../../../../ado/services/directorio.service';
import { ElementoInspeccion } from '../../../../entities/elemento-inspeccion';

@Component({
  selector: 'app-evidencias-elemento-inspeccion',
  templateUrl: './evidencias-elemento-inspeccion.component.html',
  styleUrls: ['./evidencias-elemento-inspeccion.component.scss'],
})
export class EvidenciasElementoInspeccionComponent implements OnInit {

  loadingImg;
  elementoInspeccion: ElementoInspeccion;
  listaImagenes = [];
  constructor(
    private modalController: ModalController,
    private directorioService: DirectorioService,
    private domSanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    await this.leerListaImagenes();
    this.cargarDocumentos();

  }

  async leerListaImagenes() {
    await this.modalController.getTop().then(data => {
        this.elementoInspeccion = (<any>data).componentProps.value;
        return (<any>data).componentProps.value;
    });
}
  cargarDocumentos() {
    if (this.elementoInspeccion.calificacion.documentosList != null && this.elementoInspeccion.calificacion.documentosList.length > 0) {
      this.loadingImg = true;
      this.listaImagenes = [];
      this.elementoInspeccion.calificacion.documentosList.forEach(doc => {
          this.directorioService.download(doc.id)
              .then(data => {
                  const urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(<Blob> data));
                  this.listaImagenes.push({ source: Object.values(urlData) });
                  this.listaImagenes = this.listaImagenes.slice();
                  this.loadingImg = false;

              })
              .catch(err => {
                  this.loadingImg = false;
              });
      });
    }
  }

  anterior() {
    this.modalController.dismiss();
}

}
