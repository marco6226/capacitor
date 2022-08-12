import { DomSanitizer } from '@angular/platform-browser';
import { SeguimientosService } from './../../services/seguimientos.service';
import { Empleado } from './../../../emp/entities/empleado';
import { Component, Input, OnInit, Output, OnChanges, SimpleChanges, EventEmitter, SecurityContext } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Criteria } from '../../../com/entities/filter';
import { FilterQuery } from '../../../com/entities/filter-query';
import { EmpleadoService } from '../../../com/services/empleado.service';
import { SesionService } from '../../../com/services/sesion.service';
import { Usuario } from '../../../emp/entities/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { OfflineService } from '../../../com/services/offline.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { Util } from '../../../com/utils/util';
//import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-tarea-cierre',
  templateUrl: './tarea-cierre.component.html',
  styleUrls: ['./tarea-cierre.component.scss'],
  providers: [Camera]
})
export class TareaCierreComponent implements OnInit{

  @Input() value;
  @Input() Estado;
  @Input() IsSeguimiento: boolean=false;
  @Input() isCierre: boolean = false;
  @Output() DatosCierre = new EventEmitter<object>();

  fechaActual: Date = new Date();
  maxDate: string = new Date().toISOString();
  minDate: string;
  selectDate;
  usuarioCierre: UserCierre;
  obj;
  imgURL: any;
  imgURL2: any;
  isCerrado: boolean= false;
  sinCierre: boolean= false;
  caseImage=[];
  evidencesCierre;
  imgCierre:any;
  trackings;
  valDescripcion: string;
  tareaForm: FormGroup;

  numMaxFotos: number;
  options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 960,
    targetHeight: 960,
  };
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

  imagenes: any[] = [];
  user: Usuario;
  empleado: Empleado;
  nombreEmpleado: string;
  empleadoId;
  labelDescripcion: string="Descripción de la acción realizada";
  labelFecha: string="Fecha de cierre";
  labelCorreo: string="Usuario que gestiona";
  labelTitulo: string="Datos de cierre";
  followImage: FollowImage;

  constructor(
    private camera: Camera,
    private sesionService: SesionService,
    private empleadoService: EmpleadoService,
    public alertController: AlertController,
    private modalController: ModalController,
    private seguimientoService: SeguimientosService,
    public toastController: ToastController,
    private offlineService: OfflineService,
    private directorioService: DirectorioService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
  ) { 
    this.numMaxFotos = this.offlineService.sessionService.getConfigParam('NUM_MAX_FOTO_INP');
    this.tareaForm = fb.group({
      id: ["", Validators.required],
      usuarioCierre: ["", Validators.required],
      email: ["", null],
      fechaCierre: ["", Validators.required],
      descripcionCierre: ["", Validators.required],
      evidences: [[]],
    });
  }

  async ngOnInit() {
    console.log(this.value, this.value.descripcion_cierre, this.Estado)
    await this.selectUsuario();
    this.rangoFechaCierre();    
    this.selectDate = this.maxDate;
    
    this.change();

    if(this.IsSeguimiento){
      this.labelDescripcion = "Descripción del seguimiento";
      this.labelFecha = "Fecha del seguimiento";
      this.labelCorreo = "Usuario que realiza el seguimiento";
      this.labelTitulo = "Crear nuevo seguimiento";
      this.value.descripcion_cierre = "";
    }
    // console.log(this.imagenes)
    this.validarCerrado();
  }

  validarCerrado(){
    if(this.Estado=='Cerrada en el tiempo'||this.Estado=='Cerrada fuera de tiempo'){
      this.isCerrado = true;
      this.sinCierre = true;
      this.evidenciasCierre();
    }
  }

  async selectUsuario(){
    this.user = this.sesionService.getUsuario();
    console.log(this.user)

    let fq = new FilterQuery();
    fq.filterList = [{ field: 'usuario.id', value1: this.user.id, criteria: Criteria.EQUALS, value2: null }];
    await this.empleadoService.findByFilter(fq).then(
      resp => {
        this.empleado = (<Empleado[]>resp['data'])[0];
        if (this.empleado != null) {
          this.nombreEmpleado = this.empleado.primerNombre + " " + this.empleado.primerApellido
        }
      }
    );

      console.log(this.empleado)
      this.empleadoId = await this.empleado.id
  }

  rangoFechaCierre(){
    let permiso = this.sesionService.getPermisosMap()["SEC_CHANGE_FECHACIERRE"];
    if (permiso != null && permiso.valido == true) {
        this.minDate = "2000-01-01";
    } else {
        this.minDate = this.maxDate;
    }
    console.log(permiso)
  }
  

  getPicture(){
    this.camera
      .getPicture(this.options)
      .then((imageData) => {
          let imgUrl= (<any>window).Ionic.WebView.convertFileSrc(imageData);
          // console.log(imgUrl)
          this.imagenes.push(imgUrl);
          this.imagenes = this.imagenes.slice();
          // console.log(this.imagenes)
          this.caseImage=[];
          this.imagePost();
      })
        .catch((error) => {
            console.error(error);
        });
        // console.log(this.imagenes)
}
  
  async presentAlert(header: string, msg: string){
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [{ text: 'Adescripcionptar' }]
    });
    await alert.present();
  } 

  async presentRemoveImg(index: number) {
    this.removerImg(index)
}

removerImg(index: number) {
  

  // localStorage.removeItem(imgurl);
}

  imgLoaded(){
    console.log('loaded');
  }
 
  
  async change(){
    this.valDescripcion = this.value.descripcion_cierre;
  //   this.usuarioCierre={id: this.empleadoId}

  //  await this.DatosCierre.emit({
  //    correo: this.user.email,
  //    nombre: this.nombreEmpleado,
  //    fechaDeCierre: this.selectDate,
  //    Descripcion: this.value.descripcion_cierre,
  //    Evidencias: this.caseImage,
  //    usuarioCierre: this.usuarioCierre,
  //  })
  }

 
    

  async presentAlertaSalir() {
    const alert = await this.alertController.create({
      header: '¿Desea salir?',
      message: 'El seguimiento no ha sido guardado, los datos serán descartados. ¿Confirma esta acción?',
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

  async guardarCierre(){
    if(this.valDescripcion == null || this.valDescripcion == ""){
      await this.presentToast('Por favor diligencie los datos faltantes del cierre');
      return;
    }else{
      
      await this.tareaForm.patchValue({ 
        id: parseInt(this.value.id),
        usuarioCierre: this.usuarioCierre, 
        descripcionCierre: this.valDescripcion,
        email: this.user.email,
        fechaCierre: this.selectDate,
        evidences: this.caseImage,
      });
      console.log(this.tareaForm)

      let res = await this.seguimientoService.closeTarea(
        this.tareaForm.value
      );
      this.isCerrado = true;
      if (res) {
          this.tareaForm.reset();
          // this.submitted = false;
          // this.cargando = false;
          console.log("si guardo")
          await this.presentToast('¡Se ha cerrado exitosamente esta tarea!');
           this.getTarea();
         /* this.msgs.push({
              severity: "success",
              summary: "Mensaje del sistema",
              detail: "¡Se ha cerrado exitosamente esta tarea!",
          }); */
      }
    }
  }

  async guardarSeguimiento(){

    if(this.valDescripcion==null || this.valDescripcion == ""){
      await this.presentToast('Por favor diligencie los datos faltantes del seguimiento');
    }else{
      this.followImage = {
        tareaId: await this.value.id,
        pkUser: await this.value.usuario,
        followDate: await this.selectDate,
        description: await this.valDescripcion,
        evidences: await this.caseImage,
      }

      let res = await this.seguimientoService.createSeg(await this.followImage);
      if (res) {
        await this.presentToast('¡Se ha creado exitosamente el seguimiento!');
        this.modalController.dismiss();
      }else{
        await this.presentToast('Ha ocurrido un error al crear el seguimiento');
      }
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }

  
  async imagePost(){
    let cod=1;
      this.imagenes.forEach( async (url) => {
        await Util.dataURLtoFile(url, 'img_' + cod + '_inp_' + this.value.id + '.jpg').then(
          async (file) => {let x =  await this.directorioService.uploadv2(file, null)
          this.obj = await{
            ruta: await x
          }
          await this.caseImage.push(await this.obj);
         });
         cod++;
     });  
  }

  async getTarea(){
    await this.DatosCierre.emit({
      fechaDeCierre: this.selectDate,
    })
  }
  
  async evidenciasCierre(){    
    this.evidencesCierre = await this.seguimientoService.getEvidences(this.value.id, "fkTareaCierre");
    
  }

  convertImg(img){
    this.imgCierre = img;
    if (this.imgCierre) {
            
      if (this.imgCierre.split(',').length > 1) this.imgCierre = this.imgCierre.split(',')[1];

      let type = this.mimeType[this.imgCierre.charAt(0)];

      if (type.ext !== 'png' && type.ext !== 'jpeg') return this.imgURL = '../../../../../assets/images/file.png';
      this.imgURL2 = 'data:image/png;base64,' + this.imgCierre;
      // console.log(this.imgURL2)
      return this.imgURL2;
    }
  }
  
}


interface UserCierre{
	id: string;	
}


interface FollowImage {
  tareaId: string,
  pkUser: number,
  followDate: string,
  description: string,
  evidences ,
};