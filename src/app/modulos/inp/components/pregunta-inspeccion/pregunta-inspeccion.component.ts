import { Component, OnInit, Input, SecurityContext, ViewChild, Output, EventEmitter } from '@angular/core';
import { ElementoInspeccion } from '../../entities/elemento-inspeccion';
import { SistemaNivelRiesgo } from '../../../com/entities/sistema-nivel-riesgo';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { OpcionCalificacion } from '../../entities/opcion-calificacion';
import { OfflineService } from '../../../com/services/offline.service';
import { Calificacion } from '../../entities/calificacion';
import { TipoHallazgo } from '../../entities/tipo-hallazgo';
import { AlertController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'sm-preguntaInspeccion',
  templateUrl: './pregunta-inspeccion.component.html',
  styleUrls: ['./pregunta-inspeccion.component.scss'],
  providers: [Camera]
})
export class PreguntaInspeccionComponent implements OnInit {

  @Output("onCalificacionChange") onCalificacionChange = new EventEmitter();
  @ViewChild("ionSlides") ionSlides: IonSlides;

  private _elementoActual: ElementoInspeccion;
  @Input('usarTipoHallazgo') usarTipoHallazgo: boolean;
  @Input('usarNivelRiesgo') usarNivelRiesgo: boolean;
  @Input('opcionCalificacionList') opcionCalificacionList: OpcionCalificacion[];
  sistNivelRiesgo: SistemaNivelRiesgo;
  // image: any;
  imagenes: any[] = [];
  elementoParents: string[];
  numMaxFotos: number;



  options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 960,
    targetHeight: 960,
  }


  constructor(
    public alertController: AlertController,
    private offlineService: OfflineService,
    private camera: Camera,
  ) {
    this.numMaxFotos = this.offlineService.sessionService.getConfigParam('NUM_MAX_FOTO_INP');
  }

  // getPicture() {
  //   let options: CameraOptions = {
  //     quality: 75,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     correctOrientation: true,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     targetWidth: 960,
  //     targetHeight: 960,
  //   }
  //   this.camera.getPicture(options)
  //     .then(imageData => {
  //       let imgKey = this.elementoActual.calificacion['img_key'];
  //       if (imgKey == null) {
  //         imgKey = new Date().toISOString();
  //       } else {
  //         localStorage.removeItem(imgKey);
  //       }
  //       this.elementoActual.calificacion['img_key'] = imgKey;
  //       let ionImageUrl = (<any>window).Ionic.WebView.convertFileSrc(imageData);
  //       this.image = this.domSanitizer.bypassSecurityTrustResourceUrl(ionImageUrl);
  //       localStorage.setItem(imgKey, ionImageUrl);
  //     })
  //     .catch(error => console.error(error));
  // }

  getPicture() {
    if (this.imagenes != null && this.imagenes.length >= this.numMaxFotos) {
      this.presentAlert("Número máximo de fotografías alcanzado", "No es posible adjuntar mas de " + this.numMaxFotos + " fotografía(s) por hallazgo");
      return;
    }
    this.camera.getPicture(this.options)
      .then(imageData => {
        let imgsUrls = this.elementoActual.calificacion['img_key'];
        if (imgsUrls == null)
          imgsUrls = [];

        if (this.imagenes == null)
          this.imagenes = [];

        let imgUrl = (<any>window).Ionic.WebView.convertFileSrc(imageData);
        imgsUrls.push(imgUrl);

        // let imgKey = new Date().toISOString();
        // imgsKeys.push(imgKey);
        // localStorage.setItem(imgKey, imgUrl);

        this.elementoActual.calificacion['img_key'] = imgsUrls;

        this.imagenes.push(imgUrl);
        this.imagenes = this.imagenes.slice();
      }).catch(error => {
        console.error(error);
      });
  }

  ngOnInit() {
    // -- Consulta niveles de riesgo
    this.offlineService.querySistemaNivelRiesgo().then(
      resp => this.sistNivelRiesgo = resp['data'][0]
    );
  }

  @Input('elementoInspeccion') set elementoActual(value: ElementoInspeccion) {
    console.log("Setting elemento...");
    this._elementoActual = value;
    this.imagenes = null;
    if (value != null && value.calificacion != null) {
      this._elementoActual.calificacion = value.calificacion;
      let imgsUrls = value.calificacion['img_key'];
      if (imgsUrls != null) {
        this.imagenes = [];
        imgsUrls.forEach(imgurl => this.imagenes.push(imgurl));
      }
    } else {
      this._elementoActual.calificacion = new Calificacion();
      this._elementoActual.calificacion.elementoInspeccion = new ElementoInspeccion();
      this._elementoActual.calificacion.elementoInspeccion.id = this._elementoActual.id;
      this._elementoActual.calificacion.tipoHallazgo = new TipoHallazgo();
    }
    this.elementoParents = [];
    this.fillElementosParent(this._elementoActual, this.elementoParents);
  }

  fillElementosParent(elem: ElementoInspeccion, elementos: string[]) {
    if (elem.elementoInspeccionPadre != null) {
      this.fillElementosParent(elem.elementoInspeccionPadre, elementos);
    }
    elementos.push((elem.codigo == null ? '' : elem.codigo + ' ') + elem.nombre);
  }

  get elementoActual() {
    return this._elementoActual;
  }

  removerImg(index: number) {
    let imgsUrls = this.elementoActual.calificacion['img_key'];
    // let imgurl = imgsUrls[index];

    let imgsAux = this.imagenes.slice();
    imgsAux.splice(index, 1);
    this.imagenes = null;

    imgsUrls.splice(index, 1);
    this.elementoActual.calificacion['img_key'] = imgsUrls;

    setTimeout(() => {
      this.imagenes = imgsAux;
    }, 50);

    // localStorage.removeItem(imgurl);
  }

  async presentRemoveImg(index: number) {
    const alert = await this.alertController.create({
      header: '¿Desea remover la fotografía?',
      message: 'La fotografía será eliminada. ¿Confirma esta acción?',
      buttons: [{
        text: 'Si',
        handler: () => this.removerImg(index)
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'No'
      }]
    });
    await alert.present();
  }

  async presentAlert(header: string, msg: string) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [{ text: 'Aceptar' }]
    });
    await alert.present();
  }

  emitirCambioCalificacion(event) {
    this.onCalificacionChange.emit(event.detail.value);
  }
}
