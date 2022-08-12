import { AuthService } from './../../../com/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, ToastController, PopoverController } from '@ionic/angular';
import { Programacion } from '../../entities/programacion';

import { ListaInspeccionService } from '../../services/lista-inspeccion.service';
import { InspeccionService } from '../../services/inspeccion.service';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { ElementoInspeccion } from '../../entities/elemento-inspeccion';
import { Calificacion } from '../../entities/calificacion';
import { Inspeccion } from '../../entities/inspeccion';
import { FormularioComponent } from '../../../com/components/formulario/formulario.component';
import { RespuestaCampo } from '../../../com/entities/respuesta-campo';
import { Util } from '../../../com/utils/util'
import { OfflineService } from '../../../com/services/offline.service';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { Area } from '../../../emp/entities/area';
import { StorageService } from '../../../com/services/storage.service';
import { ListaInspeccionPK } from '../../entities/lista-inspeccion-pk';
import { MenuListaComponent } from '../menu-lista/menu-lista.component';

@Component({
  selector: 'sm-inspeccionForm',
  templateUrl: './inspeccion-form.component.html',
  styleUrls: ['./inspeccion-form.component.scss'],
  providers: [InspeccionService]
})
export class InspeccionFormComponent implements OnInit {

  @ViewChild('formulario') formulario: FormularioComponent;
  programacion: Programacion;
  listaInspeccion: ListaInspeccion;
  elementoSelect: ElementoInspeccion;
  numeroPreguntaActual: number = -1;
  indicePreguntas: any = [];
  visibleGuardar: boolean;
  area: Area;
  esProgramada: boolean;
  areasList: Area[];

  guardando: boolean;
  loadingLI: boolean;
  listaCargada: boolean;
  listaPk: ListaInspeccionPK;

  loadingArea: boolean;
  areasCargadas: boolean;
  inspPend: Inspeccion;

  numeroRespondidas = 0;

  constructor(
    public popoverController: PopoverController,
    public toastController: ToastController,
    public storageService: StorageService,
    public alertController: AlertController,
    public modalController: ModalController,
    public listaInspeccionService: ListaInspeccionService,
    public inspeccionService: InspeccionService,
    public offlineService: OfflineService,
    public msgService: MensajeUsuarioService,
    public dirService: DirectorioService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.modalController.getTop()
      .then(data => {
        let parametro = (<any>data).componentProps;

        if (parametro.programacion != null) {
          this.esProgramada = true;
          this.programacion = parametro.programacion;
          this.listaPk = this.programacion.listaInspeccion.listaInspeccionPK;
          this.area = this.programacion.area;
        } else if (parametro.listaInspeccion != null) {
          this.esProgramada = false;
          this.listaPk = (<ListaInspeccion>parametro.listaInspeccion).listaInspeccionPK;
        } else if (parametro.inspeccion) {
          this.programacion = (<Inspeccion>parametro.inspeccion).programacion;
          this.esProgramada = this.programacion != null;
          this.inspPend = parametro.inspeccion;
          if (this.esProgramada) {
            this.listaPk = this.programacion.listaInspeccion.listaInspeccionPK;
            this.area = this.programacion.area;
          } else {
            this.listaPk = (<Inspeccion>parametro.inspeccion).listaInspeccion.listaInspeccionPK;
            this.area = (<Inspeccion>parametro.inspeccion).area;
          }
        }
        this.cargarListaInsp();
      });
  }

  construirListaAreas(listado: Area[], areas: Area[] ) {
    for (let i = 0; i < areas.length; i++) {
      let area = areas[i];
      let areaObj = <Area>{ id: area.id, nombre: area.nombre, contacto: area.contacto };
      listado.push(areaObj);
      if (area.areaList != null && area.areaList.length > 0) {
        this.construirListaAreas(listado, area.areaList);
      }
    }
  }

  cargarListaInsp() {
    this.loadingLI = true;
    this.listaCargada = null;
    this.offlineService.queryListaInspeccion(this.listaPk.id, this.listaPk.version)
      .then(data => {
        this.listaInspeccion = (<ListaInspeccion[]>data['data'])[0];
        this.indexarElementos(this.listaInspeccion.elementoInspeccionList, null);
        this.loadingLI = false;
        this.listaCargada = true;
        if (this.inspPend != null) {
          this.cargarInspeccion();
        }
      })
      .catch(err => {
        this.loadingLI = false;
        this.listaCargada = false;
      });
  }

  cargarInspeccion() {
    this.numeroRespondidas = 0;
    for (let i = 0; i < this.inspPend.calificacionList.length; i++) {
      let calf = this.inspPend.calificacionList[i];
      if (calf == null)
        continue;
      for (let j = 0; j < this.indicePreguntas.length; j++) {
        let elem: ElementoInspeccion = this.indicePreguntas[j];
        if (elem.id == calf.elementoInspeccion.id) {
          this.numeroRespondidas += (calf.opcionCalificacion != null ? 1 : 0);
          elem.calificacion = calf;
          break;
        }
      }
    }

  }


  indexarElementos(list: ElementoInspeccion[], padre: ElementoInspeccion) {
    list.forEach(element => {
      element.elementoInspeccionPadre = padre;
      if (element.elementoInspeccionList == null || element.elementoInspeccionList.length <= 0) {
        this.indicePreguntas.push(element);
      } else {
        this.indexarElementos(element.elementoInspeccionList, element);
      }
    });
  }

  anterior() {
    if (!this.validarRequerirFoto() || !this.validarDescripcion()) {
      return;
    }
    this.numeroPreguntaActual -= 1;
    if (this.numeroPreguntaActual < -1) {
      this.numeroPreguntaActual = -1;
      this.presentAlertaSalir();
      return;
    }
    if (this.numeroPreguntaActual < this.indicePreguntas.length - 1 && this.numeroPreguntaActual >= 0) {
      this.visibleGuardar = false;
      this.asignarElemento();
    }
  }

  async presentAlertaSalir() {
    const alert = await this.alertController.create({
      header: 'Salir de la inspección',
      message: '¿Que acción desea realizar?',
      buttons: [{
        text: 'Salir y descartar avances realizados',
        handler: () => this.confirmarSalir()
      },
      {
        text: 'Salir y guardar avances realizados',
        handler: () => {
          let inspeccion = this.generarInspeccion();
          if (this.inspPend == null) {
            inspeccion.fechaRealizada = new Date();
            inspeccion['hash'] = inspeccion.fechaRealizada.getTime();
            this.storageService.guardarInspeccionPendiente(inspeccion);
          } else {
            inspeccion.fechaRealizada = this.inspPend.fechaRealizada;
            inspeccion['hash'] = this.inspPend['hash'];
            this.storageService.actualizarInspeccionPendiente(inspeccion);
          }
          this.modalController.dismiss();
        }
      },
      {
        text: 'Continuar la inspección',
        role: 'cancel'
      }]
    });
    await alert.present();
  }

  async confirmarSalir() {
    const alert = await this.alertController.create({
      header: 'Salir de la inspección',
      message: '¿Confirma salir y descartar la inspección actual?',
      buttons: [{
        text: 'Si',
        handler: () => {
          for (let i = 0; i < this.indicePreguntas.length; i++) {
            let imgKey = this.indicePreguntas[i].calificacion == null ? null : this.indicePreguntas[i].calificacion['img_key'];
            if (imgKey != null)
              localStorage.removeItem(imgKey);
          }
          this.modalController.dismiss();
        }
      },
      {
        text: 'No',
        role: 'cancel'
      }]
    });
    await alert.present();
  }


  siguiente() {
    if (this.numeroPreguntaActual === this.indicePreguntas.length - 1) {
      this.visibleGuardar = true;
      return;
    }
    if (!this.validarRequerirFoto() || !this.validarDescripcion()) {
      return;
    }

    this.numeroPreguntaActual += 1;
    this.asignarElemento();
  }

  validarRequerirFoto() {
    if (
      (
        this.elementoSelect != null &&
        this.elementoSelect.calificacion != null &&
        this.elementoSelect.calificacion.opcionCalificacion != null &&
        this.elementoSelect.calificacion.opcionCalificacion.requerirDoc === true
      ) &&
      (
        this.elementoSelect.calificacion['img_key'] == null ||
        this.elementoSelect.calificacion['img_key'].length == 0
      )
    ) {
      this.presentToast(
        "Debe especificar al menos una fotografía para la calificación \""
        + this.elementoSelect.calificacion.opcionCalificacion.nombre + "\""
      );
      return false;
    }
    return true;
  }

  validarDescripcion() {
    if (
      (
        this.elementoSelect != null &&
        this.elementoSelect.calificacion != null &&
        this.elementoSelect.calificacion.opcionCalificacion != null &&
        this.elementoSelect.calificacion.opcionCalificacion.requerirDoc === true
      ) &&
      (
        this.elementoSelect.calificacion.recomendacion == null ||
        this.elementoSelect.calificacion.recomendacion === ''
      )
    ) {

      this.presentToast(
        "Debe agregar una descripción al adjuntar evidencia de la calificación \""
        + this.elementoSelect.calificacion.opcionCalificacion.nombre + "\""
      );
      return false;
    }
    return true;
  }

  asignarElemento() {
    this.elementoSelect = this.indicePreguntas[this.numeroPreguntaActual];
  }

  async presentToast(msg: string) {
    try {
      this.toastController.dismiss();
    } catch (e) { }

    const toast = await this.toastController.create({
      message: msg,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }

  generarInspeccion(validar?: boolean): Inspeccion {
    let calificacionList = [];
    for (let i = 0; i < this.indicePreguntas.length; i++) {
      let calf = <Calificacion>this.indicePreguntas[i].calificacion;
      if (validar && (calf == null || calf.opcionCalificacion == null)) {
        this.numeroPreguntaActual = i;
        this.elementoSelect = this.indicePreguntas[this.numeroPreguntaActual];
        this.visibleGuardar = this.numeroPreguntaActual == this.indicePreguntas.length - 1;
        this.presentToast('Por favor especifique la calificación de la pregunta \"' + this.elementoSelect.codigo + ' ' + this.elementoSelect.nombre + '\"');
        return;
      }
      if (validar && (calf.nivelRiesgo != null && (calf.recomendacion == null || calf.recomendacion.length <= 0))) {
        this.numeroPreguntaActual = i;
        this.elementoSelect = this.indicePreguntas[this.numeroPreguntaActual];
        this.visibleGuardar = this.numeroPreguntaActual == this.indicePreguntas.length - 1;
        this.presentToast('Por favor especifique la descripción del hallazgo según el nivel de riesgo establecido');
        return;
      }
      calificacionList.push(calf);
    }

    let inspeccion = new Inspeccion();
    inspeccion.calificacionList = calificacionList;
    inspeccion.respuestasCampoList = [];
    if (this.esProgramada) {
      inspeccion.programacion = this.programacion;
      inspeccion.area = this.programacion.area;
      inspeccion.area.id = this.programacion.area.id;
     // inspeccion.listaInspeccion.formulario = this.programacion.listaInspeccion.formulario;
      console.log(this.programacion)

      inspeccion.listaInspeccion = this.programacion.listaInspeccion;
    } else {
      inspeccion.area = this.area;
      inspeccion.listaInspeccion = new ListaInspeccion();
      inspeccion.listaInspeccion.listaInspeccionPK = this.listaInspeccion.listaInspeccionPK;
      inspeccion.listaInspeccion.nombre = this.listaInspeccion.nombre;
      inspeccion.listaInspeccion.codigo = this.listaInspeccion.codigo;
      inspeccion.listaInspeccion.formulario = this.listaInspeccion.formulario;
    }

    this.listaInspeccion.formulario.campoList.forEach(campo => {
      let respCampo = new RespuestaCampo();
      respCampo.campoId = campo.id;
      if (campo.tipo == 'timestamp' || campo.tipo == 'date') {
        respCampo.valor = new Date(this.formulario.form.value[campo.id + "_" + campo.nombre]);
      } else if (campo.tipo == 'multiple_select' && campo.respuestaCampo.valor != null) {
        respCampo.valor = Util.arrayAString(';', <string[]>campo.respuestaCampo.valor);
      } else {
        respCampo.valor = this.formulario.form.value[campo.id + "_" + campo.nombre];
      }
      inspeccion.respuestasCampoList.push(respCampo);
    });
    inspeccion.listaInspeccion.formulario = this.listaInspeccion.formulario;
    console.log(inspeccion)

    return inspeccion;
  }

  guardarInspeccion() {
    if (this.formulario.form.status == 'INVALID') {
      this.numeroPreguntaActual = -1;
      this.visibleGuardar = false;

      this.presentToast('Por favor diligencie los datos generales faltantes de la inspección');
      return;
    }
    if (!this.esProgramada && this.area == null) {
      this.presentToast('Por favor diligencie el campo ubicación');
      return;
    }

    let inspeccion = this.generarInspeccion(true);
    if (inspeccion == null)
      return;
      

    this.guardando = true;
    this.persistirInspeccion(inspeccion)
      .then(data => {
        this.guardando = false;
          this.manageResponse(data);        
        if (this.inspPend != null)
          this.storageService.borrarInspeccionPendiente(this.inspPend);
      })
      .catch(err => {
        this.guardando = false;
      });
  }

  persistirInspeccion(inspeccion: Inspeccion): Promise<any> {
    if (this.offlineService.getOfflineMode()) {
      return new Promise(async (resolve, reject) => {
        inspeccion.fechaRealizada = new Date();
        inspeccion['hash'] = inspeccion.fechaRealizada.toISOString();
        
        await this.storageService.guardarInspeccion(inspeccion)
          .then(() => resolve(inspeccion))
          .catch(err => reject(err));          
      });
    } else {
      return this.inspeccionService.create(inspeccion)
        .then(resp => {
          let inp = <Inspeccion>resp;         
          for (let i = 0; i < inp.calificacionList.length; i++) {
            let calf = inp.calificacionList[i];
            let imgsUrls = inspeccion.calificacionList[i]['img_key'];
            if (imgsUrls != null) {
              let j = 0;
              imgsUrls.forEach(url => {
                if (url != null) {
                  Util.dataURLtoFile(url, 'img_' + i + j + '_inp_calf_' + calf.id + '.jpeg').then(
                    file => this.dirService.upload(file, null, 'INP', calf.id).then(imgResp => localStorage.removeItem(url))
                  );
                }
                j += 1;
              });
            }
          }
          this.datosEmail(inp)
        });
    }
  }

  manageResponse(inspeccion: Inspeccion) {
    this.modalController.dismiss(inspeccion).then(
      resp => this.msgService.showMessage({
        tipoMensaje: 'success',
        mensaje: 'INSPECCIÓN REALIZADA',
        detalle: 'Se ha registrado correctamente la inspección'
      })
    );
  }


  async abrirMenu() {
    const popover = await this.popoverController.create({
      component: MenuListaComponent,
      cssClass: 'popover-content.sc-ion-popover-md',
      componentProps: { 'listaInspeccion': this.listaInspeccion }
    });
    popover.onDidDismiss()
      .then(param => {
        this.redireccionar(param.data);
      });
    await popover.present();
  }

  redireccionar(indice: number) {
    if (!this.validarRequerirFoto() || !this.validarDescripcion()) {
      return;
    }

    if (indice == null)
      return;

    this.numeroPreguntaActual = indice;
    this.asignarElemento();
  }

  registrarCambioCalif(event: any) {
    this.numeroRespondidas = 0;
    this.indicePreguntas.forEach((el: ElementoInspeccion) => {
      if (el.calificacion != null && el.calificacion.opcionCalificacion != null)
        this.numeroRespondidas += 1;
    });
  }

  async datosEmail(inspeccion: Inspeccion){
    let nocumple = <Calificacion[]><unknown>inspeccion.calificacionList;
    
    nocumple = nocumple.filter(function(element) {
        return element.opcionCalificacion.valor === 0;
       
        
      });
      
      let arrraynocumple = [];

      nocumple.map(item =>{
        arrraynocumple.push(item.elementoInspeccion.id)
      return arrraynocumple;
      })
    
    
      let criticos = <ElementoInspeccion[]><unknown>this.listaInspeccion.elementoInspeccionList;
    
      let  var1=[]

      for (let idx = 0; idx < criticos.length; idx++){
        let criticosInterno = <ElementoInspeccion[]><unknown>this.listaInspeccion.elementoInspeccionList[idx].elementoInspeccionList;
        var1.push( criticosInterno.filter(function(element) {
            return element.criticidad === 'Alto' || element.criticidad === 'Medio' ;
          }));
      }

      const newArray = []
      for (let idx = 0; idx < var1.length; idx++){
      var1[idx].map(item =>{
        newArray.push(item.id,item.criticidad,item.codigo,item.nombre)
        return newArray
        })
    }

    let arrayResultadoVar1=[]
          for (let idx = 0; idx < var1.length; idx++){
            var1[idx].map(item =>{
                   newArray.push(item.id)
                   arrraynocumple.forEach(element => {
                       if(item.id == element){
                           arrayResultadoVar1.push(item)
                       }
                   });
            return newArray
            })
          }

          arrayResultadoVar1.forEach(element => {
            element.elementoInspeccionPadre=[]
          });

          console.log(inspeccion)

          let dato = inspeccion.listaInspeccion.formulario.campoList.filter(item=>{
            return item.nombre.includes('Numero económico')
          });
    
          let numeroeconomico ;
          let ubicacion;
          console.log (dato);
    
        if(dato.length > 0){
          let idnumeroeconomico = dato[0].id;
       
       
    
        let dato2 = inspeccion.respuestasCampoList.filter(item=>{
            return item.campoId.toString().includes(idnumeroeconomico.toString())
          })
          console.log(dato2[0].valor);
          numeroeconomico = dato2[0].valor;
    
        }
    
          let dato3 = inspeccion.listaInspeccion.formulario.campoList.filter(item=>{
            return item.nombre.includes('Ubicación');
          });
    
    
    
          if(dato3.length > 0){
          const idubicacion = dato3[0].id;
    
       
    
        let dato4 = inspeccion.respuestasCampoList.filter(item=>{
            return item.campoId.toString().includes(idubicacion.toString());
          })
          console.log(dato4[0].valor)
        ubicacion = dato4[0].valor;
    
        }else{
            numeroeconomico = "NA"
            ubicacion ="NA"
        }


          await setTimeout(() => { 
          if(arrayResultadoVar1.length>0){
            this.authService.sendNotificationhallazgosCriticos(
              inspeccion.id,
              arrayResultadoVar1, numeroeconomico, ubicacion
            );
          }
        }, 10000);
          

}

}
