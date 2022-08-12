import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Programacion } from '../../entities/programacion';
import { FilterQuery } from '../../../com/entities/filter-query';
import { OfflineService } from '../../../com/services/offline.service';
import { StorageService } from '../../../com/services/storage.service';

import { Criteria } from '../../../com/entities/filter';
import { FiltroPipeInspeccionesListaProg } from '../inspecciones-realizadas/filtro/filtro.pipe';

@Component({
    selector: 'sm-programacionInspecciones',
    templateUrl: './programacion-inspecciones.component.html',
    styleUrls: ['./programacion-inspecciones.component.scss'],
})
export class ProgramacionInspeccionesComponent implements OnInit {
    @Output('onProgramacionSelect') onProgramacionSelect = new EventEmitter<Programacion>();
    programacionList: Programacion[];

    loading: boolean;
    progCargada: boolean;

    programacionLista: Programacion[];
    listaSecundaria: Programacion[];
    topLimit = 10;

    count = 0;
    filtFechaDesde: Date;
    filtFechaHasta: Date;
    buttonText: boolean = true;
    tituloButton: String = 'Filtrar';

    nombreFilt: string;
    fechaDesde: Date = new Date('1/01/1990');
    fechaHasta: Date = new Date();
    ListaUbicacion: Programacion[];
    ubicaionFilt: string;
    filtroToogle: boolean = false;
    rotarIcon: string='rotate(0deg)';

    constructor(private storageService: StorageService, private offlineService: OfflineService) {}

    async ngOnInit() {
        await this.cargarProgramacion();
        this.changeFilter();
    }

    async cargarProgramacion() {
        this.loading = true;
        this.progCargada = null;
        await this.offlineService
            .queryProgramacionList()
            .then((resp) => {
                this.programacionList = [];
                this.listaSecundaria=[];
                (<any[]>resp['data']).forEach(async (dto) => {
                    // console.log(resp);
                    await this.listaSecundaria.push(FilterQuery.dtoToObject(dto));
                });
                this.loading = false;
                this.progCargada = true;
              this.programacionList = this.listaSecundaria.slice(0,this.topLimit);
              console.log(this.programacionList)
            })
            .catch((err) => {
                this.loading = false;
                this.progCargada = false;
            });
    }

    actualizarProgMetadata(id: string, aumentarRealizadas: boolean, aumentarOffline: boolean) {
        let prog: Programacion;
        for (let i = 0; i < this.programacionList.length; i++) {
            if (id == this.programacionList[i].id) {
                prog = this.programacionList[i];
                break;
            }
        }
        if (prog['offlineDone'] == null) prog['offlineDone'] = 0;
        prog.numeroRealizadas += aumentarRealizadas == null ? 0 : aumentarRealizadas ? 1 : -1;
        prog['offlineDone'] += aumentarOffline == null ? 0 : aumentarOffline ? 1 : -1;
        this.storageService.updateProgramacion(prog);
    }

    onProgSelect(prog: Programacion) {
        this.onProgramacionSelect.emit(prog);
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
        this.nombreFilt='';
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
      this.programacionList = this.filtroInterno().slice(0,this.topLimit);
      if (this.programacionList.length == this.listaSecundaria.length) {
        event.target.disabled = true;
      }
    }, 500);
    }

    filtroInterno(){
        let dataFilt =  new FiltroPipeInspeccionesListaProg().transform(this.listaSecundaria,this.fechaDesde,this.fechaHasta,this.nombreFilt,this.ubicaionFilt)
        console.log(dataFilt)
        return dataFilt;
      }
    
      changeFilter(){
        this.programacionList = this.filtroInterno().slice(0,this.topLimit);
      }
}
