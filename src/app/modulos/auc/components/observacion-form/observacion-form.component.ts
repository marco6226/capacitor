import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController, AlertController, IonSelectOption } from '@ionic/angular';
import { Tarjeta } from '../../entities/tarjeta';
import { SistemaNivelRiesgo } from '../../../com/entities/sistema-nivel-riesgo';
import { SistemaCausaRaiz } from '../../../sec/entities/sistema-causa-raiz';
import { SistemaCausaRaizService } from '../../../sec/services/sistema-causa-raiz.service';
import { Area } from '../../../emp/entities/area';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observacion } from '../../entities/observacion';
import { ObservacionService } from '../../services/observacion.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { OfflineService } from '../../../com/services/offline.service';
import { Util } from '../../../com/utils/util';
import { StorageService } from '../../../com/services/storage.service';
import { SesionService } from '../../../com/services/sesion.service';
@Component({
    selector: 'app-observacion-form',
    templateUrl: './observacion-form.component.html',
    styleUrls: ['./observacion-form.component.scss'],
    providers: [SistemaCausaRaizService, Camera, ObservacionService, DirectorioService],
})
export class ObservacionFormComponent implements OnInit {
    segments = { detalle: false, observ: true };
    tarjeta: Tarjeta;
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
    @Input() value: Tarjeta;
    @Input() value1: Observacion;
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
        this.form = fb.group({
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
    }

    async ngOnInit() {
        console.log(this.operacion, this.value, this.value1)
        this.idEmpresa = this.sesionService.getEmpresa().id;
        console.log(this.idEmpresa);

            await this.modalController.getTop().then((data) => {
                let tarjeta = (<any>data).componentProps.value;
                this.tarjeta = JSON.parse(JSON.stringify(tarjeta));
                this.tarjeta.campos = JSON.parse(this.tarjeta.campos);
                console.log(tarjeta)            
                if (this.tarjeta.usarCausaRaiz) {
                    this.offlineService.querySistemaCausaRaiz().then((data) => (this.sistemaCausaRaiz = <SistemaCausaRaiz>data));
                }
                if (this.tarjeta.usarNivelRiesgo) {
                    this.offlineService.querySistemaNivelRiesgo().then((data) => (this.sistemaNivelRiesgo = <SistemaNivelRiesgo>data['data'][0]));
                }
            });

            if(this.operacion == 'GET'){
                
                this.tarjeta = this.value;

                setTimeout(() => {
                    this.isVisible=false
                }, 5);
                

                this.formGet = this.fb.group({
                    id: this.value1.id,
                    tipoObservacion: [this.value1.tipoObservacion, Validators.required],
                    afecta: this.value1.afecta,
                    descripcion: [this.value1.descripcion, Validators.required],
                    recomendacion: this.value1.recomendacion,
                    nivelRiesgo: this.value1.nivelRiesgo,
                    causaRaiz: null,
                    area: [this.value1.area, Validators.required],
                    personasobservadas: this.value1.personasobservadas,
                    personasabordadas: this.value1.personasabordadas,
                });

                // this.formGet.value.id = this.value1.id
                // this.formGet.value.tipoObservacion = this.value1.tipoObservacion;
                // this.formGet.value.afecta = this.value1.afecta;
                // this.formGet.value.descripcion = this.value1.descripcion;
                // this.formGet.value.recomendacion = this.value1.recomendacion;
                // this.formGet.value.nivelRiesgo = this.value1.nivelRiesgo;
                // this.formGet.value.causaRaiz;
                // this.formGet.value.area = this.value1.area;
                // this.formGet.value.personasobservadas = this.value1.personasobservadas;
                // this.formGet.value.personasabordadas = this.value1.personasabordadas ;


                this.form.value.id = this.value1.id
                this.form.value.tipoObservacion = this.value1.tipoObservacion;
                this.form.value.afecta = this.value1.afecta;
                this.form.value.descripcion = this.value1.descripcion;
                this.form.value.recomendacion = this.value1.recomendacion;
                this.form.value.nivelRiesgo = this.value1.nivelRiesgo;
                this.form.value.causaRaiz;
                this.form.value.area = this.value1.area;
                this.form.value.personasobservadas = this.value1.personasobservadas;
                this.form.value.personasabordadas = this.value1.personasabordadas ;
                console.log("form",this.form.value,this.form.valid)
                console.log("formGet",this.formGet.value,this.formGet.valid)
                this.leerObservacionSeleccionada();
                console.log("form",this.form.value,this.form.valid)
                console.log("formGet",this.formGet.value,this.formGet.valid)
            }
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
        observacion.tipoObservacion = this.form.value.tipoObservacion;
        observacion.descripcion = this.form.value.descripcion;

        let implicacionList = [];
        this.buildList('implicacionList', this.tarjeta.implicacionList, implicacionList);
        observacion.implicacionList = implicacionList;

        observacion.area = this.form.value.area;
        this.areaResp = this.form.value.area;
        this.disabled = false;
        observacion.afecta = this.form.value.afecta;
        observacion.recomendacion = this.form.value.recomendacion;

        let causaRaizList = [];
        if (this.sistemaCausaRaiz != null && this.sistemaCausaRaiz.causaRaizList.length > 0) this.buildList('causaRaizList', this.sistemaCausaRaiz.causaRaizList, causaRaizList);
        observacion.causaRaizList = causaRaizList;

        observacion.personasabordadas = this.form.value.personasabordadas;
        observacion.personasobservadas = this.form.value.personasobservadas;


        observacion.nivelRiesgo = this.form.value.nivelRiesgo;
        observacion.tarjeta = new Tarjeta();
        observacion.tarjeta.id = this.tarjeta.id;
        observacion.tarjeta.nombre = this.tarjeta.nombre;
        this.guardando = true;
        this.persistirObservacion(observacion)
            .then((resp) => {
                this.manageResponse(resp);
                this.guardando = false;
            })
            .catch((err) => {
                this.guardando = false;
            });
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
            return this.observacionService.create(observacion).then((data) => {
                observacion.id = (<Observacion>data).id;

                let cod = 1;
                this.imagenes.forEach((url) => {
                    Util.dataURLtoFile(url, 'img_' + cod + '_obs_' + observacion.id + '.jpeg').then((file) => this.directorioService.upload(file, null, 'AUC', observacion.id));
                    cod++;
                });
            });
        }
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

    // opcionSeleccionada(): boolean {
    //     var opcion:IonSelectOption = document.getElementById('seleccionar');
    //     return opcion.value==
    // }
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
          console.log("hola",this.datosTarjeta, this.value1)
          console.log("hola2",this.tarjeta, this.value)

        //   console.log(this.tarjeta.implicacionList, this.datosTarjeta.implicacionList)
        // this.tarjeta = this.value;
        // this.datosTarjeta = this.value1;
        // await this.modalController.getTop()
        // .then(data => {
        //   this.consultar = (<any>data).componentProps.operacion == 'GET';
        //   if (this.consultar == true) {
        //     this.datosTarjeta = (<any>data).componentProps.value1;
            this.datosTarjeta = this.value1
            this.areaResp=this.datosTarjeta.area;
            Util.cargarSeleccionArbol('implicacionlist', this.tarjeta.implicacionList, this.value1.implicacionList,'id');
            for(let i = 0; i<this.tarjeta.implicacionList.length;i++){
                Util.cargarSeleccionArbol('implicacionlist', this.tarjeta.implicacionList[i].implicacionList, this.value1.implicacionList,'id');
            }
            this.disabled = false;
        //   }
        // });
      }
    
      editarObservacion(){
          if(this.formGet.valid){
            console.log("guardo")
          }          
      }
}
