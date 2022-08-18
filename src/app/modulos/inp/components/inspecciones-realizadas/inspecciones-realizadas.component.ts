import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { Console } from 'console';
import { FilterQuery } from '../../../com/entities/filter-query';
import { OfflineService } from '../../../com/services/offline.service';
import { StorageService } from '../../../com/services/storage.service';
import { TareaSeguimientoComponent } from '../../../sec/components/tarea-seguimiento/tarea-seguimiento.component';
import { Inspeccion } from '../../entities/inspeccion';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { InspeccionConsultarFormComponent } from '../inspeccion-consultar-form/inspeccion-consultar-form.component';
import { FiltroPipeInspecciones } from './filtro/filtro.pipe';

@Component({
    selector: 'sm-inspeccion-realizada',
    templateUrl: './inspecciones-realizadas.component.html',
    styleUrls: ['./inspecciones-realizadas.component.css'],
})
export class InspeccionesRealizadasComponent implements OnInit {
    @Output('onInspSelect') onInspSelect = new EventEmitter<Inspeccion>();
    inspList: Inspeccion[];
    listaSecundaria: Inspeccion[];
    topLimit = 10;
    
    loading: boolean;
    inspCargadas: boolean;
    filtFechaHasta: any;
    filtFechaDesde: any;
    buttonText = true;
    count: number;
    tituloButton: String = 'Filtrar';

    textoFilt: string;
    campoFilt: string;
    fechaDesde: Date = new Date('1/01/1990');
    fechaHasta: Date = new Date();
    ListaUbicacion: Inspeccion[];
    ubicaionFilt: string;
    filtroToogle: boolean = false;
    rotarIcon: string='rotate(0deg)';


    constructor(private offlineService: OfflineService, private storageService: StorageService, public modalController: ModalController) {}

    ngOnInit() {
        this.cargarRealizadas();
        // setTimeout(() => {
        //     this.extraerUbicacion();            
        // }, 1000);
    }


    cargarRealizadas() {
        this.loading = true;
        this.inspCargadas = null;
        this.offlineService
            .queryInspeccionesRealizadas()
            .then((resp) => {
                this.inspList=[];
                this.listaSecundaria=[];
                (<any[]>resp['data']).forEach((dto) => {
                    // this.inspList.push(FilterQuery.dtoToObject(dto)); //Llenar la lista de inspecciones con los datos
                    this.listaSecundaria.push(FilterQuery.dtoToObject(dto)); //Llenar la lista de inspecciones con los datos
                });
                this.loading = false;
                this.inspCargadas = true;
                this.inspList = this.listaSecundaria.slice(0,this.topLimit);
            })
            .catch((err) => {
                this.loading = false;
                this.inspCargadas = false;
            });
    }


    async abrirInspeccion(inspeccion: Inspeccion) {
        const modal = await this.modalController.create({
            component: InspeccionConsultarFormComponent,
            componentProps: { value: inspeccion },
            cssClass: 'modal-fullscreen',
        });
        return await modal.present();
    }

    onInspeccionSelect(inspeccion: Inspeccion) {
        this.onInspSelect.emit(inspeccion);
    }

    filtrarInspecciones(){

        this.filtroToogle = !this.filtroToogle;

        if(this.filtroToogle){
            this.rotarIcon='rotate(180deg)'
        }
        else{
            this.rotarIcon='rotate(0deg)'
        }
        this.extraerUbicacion();
    }

    borrarFiltros(){
        this.textoFilt='';
        this.campoFilt='';
        this.fechaDesde = new Date('1/01/1990');
        this.fechaHasta = new Date();
        this.ubicaionFilt = '';
    }

    extraerUbicacion(){
          
          var hash = {};
          if(this.listaSecundaria.length>0){
            this.ListaUbicacion = this.listaSecundaria.filter(function(current) {
                if(current.area.nombre != null){
                    var exists = !hash[current.area.nombre];
                    hash[current.area.nombre] = true;
                    return exists;
                }
              });
          }          
    }

    
    loadData(event) {
        setTimeout(() => {
          console.log('Done');
          this.topLimit +=10;
          event.target.complete();
          this.inspList = this.filtroInterno().slice(0,this.topLimit);
          if (this.inspList.length == this.listaSecundaria.length) {
            event.target.disabled = true;
          }
        }, 500);
    }

    filtroInterno(){
        let dataFilt =  new FiltroPipeInspecciones().transform(this.listaSecundaria,this.textoFilt,this.campoFilt,this.fechaDesde,this.fechaHasta,this.ubicaionFilt)
        console.log(dataFilt)
        return dataFilt;
      }
    
      changeFilter(){
        this.inspList = this.filtroInterno().slice(0,this.topLimit);
      }
}
