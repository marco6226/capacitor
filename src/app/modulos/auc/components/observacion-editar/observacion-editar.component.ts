import { ModalController, AlertController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { Tarjeta } from '../../entities/tarjeta';
import { Observacion } from '../../entities/observacion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SistemaCausaRaizService } from '../../../sec/services/sistema-causa-raiz.service';
import { ObservacionService } from '../../services/observacion.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Camera } from '@capacitor/camera';

import { StorageService } from '../../../com/services/storage.service';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { OfflineService } from '../../../com/services/offline.service';
import { SesionService } from '../../../com/services/sesion.service';
import { SistemaNivelRiesgo } from '../../../com/entities/sistema-nivel-riesgo';
import { SistemaCausaRaiz } from '../../../sec/entities/sistema-causa-raiz';
import { Area } from '../../../emp/entities/area';
import { Util } from '../../../com/utils/util';

@Component({
  selector: 'app-observacion-editar',
  templateUrl: './observacion-editar.component.html',
  styleUrls: ['./observacion-editar.component.scss'],
  providers: [SistemaCausaRaizService, Camera, ObservacionService, DirectorioService],
})
export class ObservacionEditarComponent implements OnInit {
  segments = { detalle: false, observ: true };
  camposTarjeta: Tarjeta;
  form: FormGroup;
  sistemaNivelRiesgo: SistemaNivelRiesgo;
  sistemaCausaRaiz: SistemaCausaRaiz;
  areasList: Area[];
  imagenes: any[] = [];
  idEmpresa: string;
  opcion: HTMLElement;
  labelSeleccionado: string = '';
  consultar: boolean;
  disabled: boolean= false;
  areaResp: Area;

  @Input() operacion;
  @Input() tarjeta: Tarjeta;
  @Input() observacion: Observacion;
  isVisible: boolean=true;
  formGet: FormGroup;

  options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 960,
      targetHeight: 960,
  };

  guardando: boolean;
  loading: boolean;
  areasCargadas: boolean;

  datosTarjeta: Observacion;

  constructor(
      public storageService: StorageService,
      public alertController: AlertController,
      private mensajeUsuarioService: MensajeUsuarioService,
      private directorioService: DirectorioService,
      private observacionService: ObservacionService,
      private camera: Camera,
      private offlineService: OfflineService,
      public fb: FormBuilder,
      public modalController: ModalController,
      public sesionService: SesionService
  ) {
    
  }

  async ngOnInit() {
      console.log(this.operacion, this.tarjeta, this.observacion)
   

            this.tarjeta = JSON.parse(JSON.stringify(this.tarjeta));
            this.tarjeta.campos = JSON.parse(this.tarjeta.campos);
            console.log(this.tarjeta)
        
              setTimeout(() => {
                  this.isVisible=false
              }, 5);
              
              this.formGet = this.fb.group({
                id: null,
                tipoObservacion: [null, Validators.required],
                afecta: null,
                descripcion: [null, Validators.required],
                recomendacion: null,
                nivelRiesgo: null,
                causaRaiz: null,
                area: [null, Validators.required],
                personasobservadas: null,
                personasabordadas: null,
            });  
              

              this.formGet.value.id = this.observacion.id
              this.formGet.value.tipoObservacion = this.observacion.tipoObservacion;
              this.formGet.value.afecta = this.observacion.afecta;
              this.formGet.value.descripcion = this.observacion.descripcion;
              this.formGet.value.recomendacion = this.observacion.recomendacion;
              this.formGet.value.nivelRiesgo = this.observacion.nivelRiesgo;
              this.formGet.value.causaRaiz;
              this.formGet.value.area = this.observacion.area;
              this.formGet.value.personasobservadas = this.observacion.personasobservadas;
              this.formGet.value.personasabordadas = this.observacion.personasabordadas ;
              
              this.leerObservacionSeleccionada();

  }

  anterior() {
      this.presentAlertaSalir();
  }

  async presentAlertaSalir() {
      const alert = await this.alertController.create({
          header: '¿Desea salir?',
          message: 'La observación no ha sido guardada, los datos serán descartados. ¿Confirma esta acción?',
          buttons: [
              {
                  text: 'Si',
                  handler: () => {
                      this.modalController.dismiss();
                  },
              },
              {
                  text: 'No',
                  role: 'cancel',
                  cssClass: 'No',
              },
          ],
      });
      await alert.present();
  }

  getPicture() {
      this.camera
          .getPicture(this.options)
          .then((imageData) => {
              let imgUrl = (<any>window).Ionic.WebView.convertFileSrc(imageData);
              this.imagenes.push(imgUrl);
              this.imagenes = this.imagenes.slice();
          })
          .catch((error) => {
              console.error(error);
          });
  }

  buildList(field: string, tree: any[], list: any[]) {
      tree.forEach((node) => {
          if (node[field] != null && node[field].length > 0) {
              this.buildList(field, node[field], list);
          }
          if (node['selected'] == true) {
              list.push({ id: node.id });
          }
      });
  }

  onSubmit() {}

  guardarObservacion() {
      let observacion = new Observacion();
      observacion.tipoObservacion = this.formGet.value.tipoObservacion;
      observacion.descripcion = this.formGet.value.descripcion;

      let implicacionList = [];
      this.buildList('implicacionList', this.tarjeta.implicacionList, implicacionList);
      observacion.implicacionList = implicacionList;

      observacion.area = this.formGet.value.area;
      this.areaResp = this.formGet.value.area;
      this.disabled = false;
      observacion.afecta = this.formGet.value.afecta;
      observacion.recomendacion = this.formGet.value.recomendacion;

      let causaRaizList = [];
      if (this.sistemaCausaRaiz != null && this.sistemaCausaRaiz.causaRaizList.length > 0) this.buildList('causaRaizList', this.sistemaCausaRaiz.causaRaizList, causaRaizList);
      observacion.causaRaizList = causaRaizList;

      observacion.personasabordadas = this.formGet.value.personasabordadas;
      observacion.personasobservadas = this.formGet.value.personasobservadas;
      observacion.id = this.observacion.id

      observacion.nivelRiesgo = this.formGet.value.nivelRiesgo;
      observacion.tarjeta = new Tarjeta();
      observacion.tarjeta.id = this.tarjeta.id;
      observacion.tarjeta.nombre = this.tarjeta.nombre;
    //   observacion.id = this.formGet.value.id;
      this.guardando = true;
      this.persistirObservacion(observacion)
          .then((resp) => {
              this.manageResponse(resp);
              this.guardando = false;
          })
          .catch((err) => {
              this.guardando = false;
          });
    // this.persistirObservacion2(observacion)
  }

  persistirObservacion(observacion: Observacion): Promise<any> {
      if (this.offlineService.getOfflineMode()) {
          return new Promise((resolve, reject) => {
              observacion['imagenes'] = this.imagenes;
              observacion.fechaObservacion = new Date();
              observacion['hashId'] = observacion.fechaObservacion.toISOString();
              this.storageService.guardarSyncObservacion(observacion);
              resolve(observacion);
          });
      } else {
          return this.observacionService.update(observacion).then((data) => {
            //   observacion.id = (<Observacion>data).id;

              let cod = 1;
              this.imagenes.forEach((url) => {
                  Util.dataURLtoFile(url, 'img_' + cod + '_obs_' + observacion.id + '.jpeg').then((file) => this.directorioService.upload(file, null, 'AUC', observacion.id));
                  cod++;
              });
          });
      }
  }

  persistirObservacion2(observacion: Observacion){
   console.log(observacion)
}

  manageResponse(observacion: Observacion) {
      this.modalController.dismiss(observacion).then((resp) =>
          this.mensajeUsuarioService.showMessage({
              tipoMensaje: 'success',
              mensaje: 'OBSERVACIÓN REALIZADA',
              detalle: 'Se ha registrado correctamente la observación',
          })
      );
  }

  segmentChanged(event) {
      for (var seg in this.segments) {
          this.segments[seg] = false;
          if (event.detail.value == seg) this.segments[seg] = true;
      }
  }

  async presentRemoveImg(index: number) {
      const alert = await this.alertController.create({
          header: '¿Desea remover la fotografía?',
          message: 'La fotografía será eliminada. ¿Confirma esta acción?',
          buttons: [
              {
                  text: 'Si',
                  handler: () => this.removerImg(index),
              },
              {
                  text: 'No',
                  role: 'cancel',
                  cssClass: 'No',
              },
          ],
      });
      await alert.present();
  }

  removerImg(index: number) {
      let imgsAux = this.imagenes.slice();
      imgsAux.splice(index, 1);
      this.imagenes = null;
      setTimeout(() => {
          this.imagenes = imgsAux;
      }, 50);
  }

    async leerObservacionSeleccionada(){
        console.log("hola", this.observacion)
        console.log("hola2",this.tarjeta)

          this.areaResp=this.observacion.area;
          Util.cargarSeleccionArbol('implicacionlist', this.tarjeta.implicacionList, this.observacion.implicacionList,'id');
          for(let i = 0; i<this.tarjeta.implicacionList.length;i++){
              Util.cargarSeleccionArbol('implicacionlist', this.tarjeta.implicacionList[i].implicacionList, this.observacion.implicacionList,'id');
          }
          this.disabled = false;
    }
 
    editarObservacion(){
        if(this.formGet.valid){
          console.log("guardo")
        }          
    }
}
