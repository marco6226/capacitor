import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ModalController } from '@ionic/angular';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { Criteria, Filter } from '../../../com/entities/filter';
import { FilterQuery } from '../../../com/entities/filter-query';
import { SistemaNivelRiesgo } from '../../../com/entities/sistema-nivel-riesgo';
import { EmpleadoService } from '../../../com/services/empleado.service';
import { OfflineService } from '../../../com/services/offline.service';
import { SistemaNivelRiesgoService } from '../../../com/services/sistema-nivel-riesgo.service';
import { Area } from '../../../emp/entities/area';
import { Empleado } from '../../../emp/entities/empleado';
import { Calificacion } from '../../entities/calificacion';
import { ElementoInspeccion } from '../../entities/elemento-inspeccion';
import { Inspeccion } from '../../entities/inspeccion';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { InspeccionService } from '../../services/inspeccion.service';
import { ListaInspeccionService } from '../../services/lista-inspeccion.service';
import { ListaInspeccionFormComponent } from '../inspeccion-form/lista-inspeccion-form/lista-inspeccion-form.component';
import { SesionService } from '../../../com/services/sesion.service';
import { Usuario } from '../../../emp/entities/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NumeroEconomicoService } from '../../services/numero-economico.service';
import { Bitacora } from '../../entities/bitacora';


@Component({
    selector: 'app-inspeccion-consultar-form',
    templateUrl: './inspeccion-consultar-form.component.html',
    styleUrls: ['./inspeccion-consultar-form.component.scss'],

})
export class InspeccionConsultarFormComponent implements OnInit {
    @ViewChild('listaInspeccionForm') listaInspeccionForm: ListaInspeccionFormComponent;

    idEmpresa: string;


    consultar: boolean;
    inspeccionId: string;
    inspeccion: Inspeccion;
    inspList: Inspeccion[];
    empleadoElabora: Empleado;
    
    bitacoraList: Bitacora[]=[];
    idNumeroEconomico;

    fechaActual = new Date();
    user: Usuario;
    empleado: Empleado;
    nombreEmpleado: string;
    cargo: string;

    equipo: string;
    observacion: string;

    // Form: FormGroup;
    public FormHseq: FormGroup;
    public FormIng: FormGroup;
    public FormBitacora: FormGroup;

    permisoHse:boolean=false;
    permisoIngenieria:boolean=false;
    estado:boolean=false;
    mostarHseGet: boolean=true;
    mostarIngGet: boolean=true;
    maxDateHse: string = new Date().toISOString();
    minDateHse: string = new Date().toISOString();
    selectDateHse;
    selectDateBitacora: Date = new Date();
    maxDateIngenieria: string = new Date().toISOString();
    minDateIngenieria: string;
    selectDateIngenieria;
    isEmpleadoValid: boolean;

    imagenesList: any = [];

    // imagenesList: any=[];
    id: string;
   // nivelRiesgoList: SelectItem[] = [{ label: '--seleccione--', value: null }];
    listaInspeccion: ListaInspeccion;
    area: Area;
    firma = [];

     // Configuration for each Slider
  slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        autoplay: true, pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
        }
  };

  EstadoOptionList = [
        { label: "Disponible", value: "Disponible" },
        { label: "Parado por lluvia", value: "Parado por lluvia" },
        { label: "Reparación", value: "Reparación" },
        { label: "Varado", value: "Varado" },
        { label: "Operativo", value: "Operativo" },
    ];



    constructor(
        private modalController: ModalController,
        private alertController: AlertController,
        private offlineService: OfflineService,
        private inspeccionService: InspeccionService,
        private directorioService: DirectorioService,
        private empleadoService: EmpleadoService,
        private listaInspeccionService: ListaInspeccionService,
        private sistemaNivelRiesgoService: SistemaNivelRiesgoService,
        private domSanitizer: DomSanitizer,
        private sesionService: SesionService,
        private fb: FormBuilder,
        private numeroEconomicoService: NumeroEconomicoService
        ) {
            this.FormHseq = this.fb.group({
                concepto: [null,Validators.required],
                usuarioGestiona: [null,Validators.required],
                cargo: [null,Validators.required],
                fecha: [Date,Validators.required]
            });
            this.FormIng = this.fb.group({
                concepto: [null,Validators.required],
                usuarioGestiona: [null,Validators.required],
                cargo: [null,Validators.required],
                fecha: [Date,Validators.required]
            });
            this.FormBitacora = this.fb.group({
                fecha: [Date, Validators.required],
                actividad: [null, Validators.required]
            })
        }

    async ngOnInit() {
        this.idEmpresa = this.sesionService.getEmpresa().id;
        console.log(this.maxDateIngenieria)
        // this.empleado = this.empleado;
        await this.leerInspeccionSeleccionada();
        await this.selectUsuario();
        this.cargaDatosLista();  
        
            
    }

    async leerInspeccionSeleccionada() {
        await this.modalController.getTop().then(data => {

            this.inspeccion = (<any>data).componentProps.value;
            this.id = this.inspeccion.id;
            this.equipo = this.inspeccion.equipo;
            this.observacion = this.inspeccion.observacion;
            return (<any>data).componentProps.value;
        });
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
              this.nombreEmpleado = this.empleado.primerNombre + " " + this.empleado.segundoNombre + " " +
               this.empleado.primerApellido + " " + this.empleado.segundoApellido;
               this.cargo = this.empleado.cargo.nombre
            }
          }
        );
    
          console.log(this.empleado)
      }

    getSistemaNivelRiesgo() {
        const filterQuery = new FilterQuery();
        const filter = new Filter();
        filter.criteria = Criteria.EQUALS;
        filter.field = 'seleccionado';
        filter.value1 = 'true';
        filterQuery.filterList = [filter];
        // this.sistemaNivelRiesgoService.findByFilter(filterQuery).then(
        //     resp => (<SistemaNivelRiesgo>resp['data'][0]).nivelRiesgoList.forEach(element => {
        //         this.nivelRiesgoList.push({ label: element.nombre, value: element.id });
        //     })
        // );
    }

    anterior() {
        this.modalController.dismiss();
    }

    cargaDatosLista() {

        const filter = new Filter();
        filter.criteria = Criteria.EQUALS;
        filter.field = 'id';
        filter.value1 = this.inspeccion.id;
        // filter.value1 = this.inspeccion.id;
        const filterQuery = new FilterQuery();
        filterQuery.filterList = [filter];
        this.inspeccionService
            .findByFilter(filterQuery)
            .then((resp) => {
                this.inspeccion = (<Inspeccion[]>resp['data'])[0];
                this.listaInspeccion = this.inspeccion.listaInspeccion;
                this.area = this.inspeccion.area;
                this.cargarCalificaciones(this.listaInspeccion.elementoInspeccionList, this.inspeccion.calificacionList);
                this.getListaInspeccionEvidences(
                    parseInt(this.listaInspeccion.listaInspeccionPK.id), this.listaInspeccion.listaInspeccionPK.version
                );
                console.log(this.inspeccion)
                this.vistoPermisos();
                this.loadBitacora();
                })
            .catch(err => {
            });
    }

    private buscarCalificacion(elem: ElementoInspeccion, calificacionList: Calificacion[]): Calificacion {
            for (let i = 0; i < calificacionList.length; i++) {
                if (calificacionList[i].elementoInspeccion.id === elem.id) {
                    return calificacionList[i];
                }
            }
            return null;
        }

    private cargarCalificaciones(elemList: ElementoInspeccion[], calificacionList: Calificacion[]) {
        for (let i = 0; i < elemList.length; i++) {

            if (elemList[i].elementoInspeccionList != null && elemList[i].elementoInspeccionList.length > 0) {
                this.cargarCalificaciones(elemList[i].elementoInspeccionList, calificacionList);
            } else {
                const calif = this.buscarCalificacion(elemList[i], calificacionList);
                elemList[i].calificacion = calif;
            }
        }
    }

    // CONSULTA LAS EVIDENCIAS DE LA LISTA
    async getListaInspeccionEvidences(lista_id: number, version_id: number) {
        try {
            const res: any = await this.listaInspeccionService.getInspeccionImagen(lista_id, version_id);

            if (res) {
                res.files.forEach(async (evidence) => {
                    this.directorioService.download(evidence).then((data) => {
                        const urlData = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(<Blob> data));
                        this.imagenesList.push({ source: Object.values(urlData) });
                    });
                });
            }
        } catch (e) {
        }
    }

    botonAceptar(tipo: string){
        if(tipo=='HSE'){
            this.FormHseq.value.concepto = "Aceptado"
        }
        else if(tipo=='ING'){
            this.FormIng.value.concepto = "Aceptado"
        }
        this.guardarVistoBueno()
    }

    botonDenegar(tipo: string){
        if(tipo=='HSE'){
            this.FormHseq.value.concepto = "Denegado"
        }
        else if(tipo=='ING'){
            this.FormIng.value.concepto = "Denegado"
        }
        this.guardarVistoBueno()    
    }
    
    async guardarVistoBueno(){
        try {
           
            let inspeccion = new Inspeccion();
            inspeccion.area = this.area;
            inspeccion = this.inspeccion

            inspeccion.equipo = this.equipo;
            inspeccion.observacion = this.observacion;

            if(this.FormHseq.value.concepto == 'Aceptado'||this.FormHseq.value.concepto == 'Denegado'){
                inspeccion.fechavistohse = new Date(this.FormHseq.value.fecha);
                inspeccion.empleadohse = this.empleado;
                inspeccion.conceptohse = this.FormHseq.value.concepto;
            }
            console.log(this.FormIng.value.fecha)
            if(this.FormIng.value.concepto == 'Aceptado'||this.FormIng.value.concepto == 'Denegado'){
                inspeccion.fechavistoing = new Date(this.FormIng.value.fecha) ;
                inspeccion.empleadoing = this.empleado;
                inspeccion.conceptoing = this.FormIng.value.concepto;
            }

            console.log(inspeccion, inspeccion.equipo)
                       
            inspeccion.id = this.inspeccion.id
           
            this.inspeccionService.update(inspeccion)
            .then(data => {})
            
            
        } catch (error) {
            // this.msgs = [];
            // this.msgs.push({ severity: 'warn', detail: error });
        }
        
    }

    async vistoPermisos(){

        this.isEmpleadoValid = this.empleado == null;
        console.log(this.isEmpleadoValid)       
        console.log(this.empleado)
      
        
        this.permisoHse = this.sesionService.getPermisosMap()["HSE"];
        this.permisoIngenieria = this.sesionService.getPermisosMap()["INGENIERIA"];
        this.estado = this.sesionService.getPermisosMap()["INP_GET_ESTADO"];
        if(this.permisoHse){
            this.selectDateHse = this.maxDateHse;      
            if(this.inspeccion.conceptohse != null){
                this.FormHseq = this.fb.group({
                    concepto: [this.inspeccion.conceptohse,Validators.required],
                    usuarioGestiona: [this.inspeccion.empleadohse.primerNombre + " " + this.inspeccion.empleadohse.primerApellido,Validators.required],
                    cargo: [this.inspeccion.empleadohse.cargo.nombre,Validators.required],
                    fecha: [new Date(this.inspeccion.fechavistohse),Validators.required]
                });
                this.selectDateHse = this.inspeccion.fechavistohse
            }
            else if(this.empleado!=null){
                this.FormHseq = this.fb.group({
                    concepto: [null,Validators.required],
                    usuarioGestiona: [this.empleado.primerNombre + " " + this.empleado.primerApellido ,Validators.required],
                    cargo: [this.empleado.cargo.nombre,Validators.required],
                    fecha: [this.maxDateHse,Validators.required]
                });
            }
            else{
                this.FormHseq = this.fb.group({
                    concepto: [null,Validators.required],
                    usuarioGestiona: [null,Validators.required],
                    cargo: [null,Validators.required],
                    fecha: [this.maxDateHse,Validators.required]
                });
            }
        }
        else{
            this.FormHseq = this.fb.group({
                concepto: [null,Validators.required],
                usuarioGestiona: [null,Validators.required],
                cargo: [null,Validators.required],
                fecha: [this.maxDateHse,Validators.required]
            });
        }  

        if(this.permisoIngenieria){
            this.selectDateIngenieria = new Date(this.maxDateIngenieria).toISOString();
            if(this.inspeccion.conceptoing != null){
                this.FormIng = this.fb.group({
                    concepto: [this.inspeccion.conceptoing,Validators.required],
                    usuarioGestiona: [this.inspeccion.empleadoing.primerNombre + " " + this.inspeccion.empleadoing.primerApellido,Validators.required],
                    cargo: [this.inspeccion.empleadoing.cargo.nombre,Validators.required],
                    fecha: [new Date(this.inspeccion.fechavistoing),Validators.required]
                });
                this.selectDateIngenieria = this.inspeccion.fechavistoing
            }
            else if(this.empleado!=null){
                this.FormIng = this.fb.group({
                    concepto: [null,Validators.required],
                    usuarioGestiona: [this.empleado.primerNombre + " " + this.empleado.primerApellido,Validators.required],
                    cargo: [this.empleado.cargo.nombre,Validators.required],
                    fecha: [this.maxDateIngenieria,Validators.required]
                });
            }
            else{
                this.FormIng = this.fb.group({
                    concepto: [null,Validators.required],
                    usuarioGestiona: [null,Validators.required],
                    cargo: [null,Validators.required],
                    fecha: [this.maxDateIngenieria,Validators.required]
                });
            }  
        }
        else{
            this.FormIng = this.fb.group({
                concepto: [null,Validators.required],
                usuarioGestiona: [null,Validators.required],
                cargo: [null,Validators.required],
                fecha: [this.maxDateIngenieria,Validators.required]
            });
        }   
    }

    rangoFechaCierreIngenieria(){
        let permiso = this.sesionService.getPermisosMap()["SEC_CHANGE_FECHACIERRE"];
        console.log(permiso)
        if (permiso != null && permiso.valido == true) {
            this.minDateIngenieria = "2021-01-01";
        } else {
            this.minDateIngenieria = this.maxDateIngenieria;
        }
    }
      
    async rangoFechaCierreHse(){
        console.log(this.sesionService.getPermisosMap())
        let permiso = await this.sesionService.getPermisosMap()["SEC_CHANGE_FECHACIERRE"];
        if (permiso != null && permiso.valido == true) {
            this.minDateHse = "2021-01-01";
        } else {
            this.minDateHse = this.maxDateHse;
        }
    }

    guardarEstadoMaquina(){
        console.log(this.observacion)
        console.log(this.equipo)
        this.guardarVistoBueno()
    }


    nuevoIngreso(){
        // console.log(this.FormBitacora)
        this.insertBitacora();
        // this.loadBitacora();
    }

    insertBitacora(){

        let bit: Bitacora={
            // id: 4,
            fecha:new Date(),
            observacion: this.FormBitacora.value.actividad,
            pk_numero_economico_id: this.idNumeroEconomico,
            pk_inspeccion_id: Number.parseInt(this.inspeccion.id)
        };

        if(this.idNumeroEconomico){
            this.inspeccionService.setBitacora(bit).then(resp=>{
                    if(resp){
                    this.loadBitacora();
                    this.FormBitacora.value.fecha=new Date();
                    this.FormBitacora.value.actividad=null;
                    }
                });
            }
        }
        

    async loadBitacora(){
        this.bitacoraList=[];
        console.log(this.listaInspeccion.formulario.campoList,this.inspeccion.respuestasCampoList)
       
        this.listaInspeccion.formulario.campoList.forEach(element => {
            if (element.nombre == "Número económico" || element.nombre == "Numero economico" || element.nombre == "Numero económico") {
                this.inspeccion.respuestasCampoList.forEach(resp => {
                    if (resp.campoId == element.id) {
                        this.inspeccionService.getNumeroEconomicoByInspeccion(resp.valor).then(resp => {
                            console.log(resp);
                            this.idNumeroEconomico=resp[0].id;
                            this.inspeccionService.getBitacora(resp[0].id, this.inspeccion.id).then((respo: Bitacora[]) => {
                                for (let index = 0; index < respo.length; index++) {
                                    this.bitacoraList.push(respo[index]);
                                }                               
                            });
                        });
                    }
                });

            }
        })
      
    }
    
}
