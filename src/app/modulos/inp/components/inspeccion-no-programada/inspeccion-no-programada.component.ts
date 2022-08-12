import { Component, OnInit, Output, EventEmitter, PipeTransform } from '@angular/core';
import { OfflineService } from '../../../com/services/offline.service';
import { ListaInspeccion } from '../../entities/lista-inspeccion';

import { Criteria } from '../../../com/entities/filter';
import { FilterQuery } from '../../../com/entities/filter-query';
import { FiltroPipeInspecciones, FiltroPipeInspeccionesLista } from '../inspecciones-realizadas/filtro/filtro.pipe';

@Component({
  selector: 'sm-inspeccionNoProgramada',
  templateUrl: './inspeccion-no-programada.component.html',
  styleUrls: ['./inspeccion-no-programada.component.scss']
})
export class InspeccionNoProgramadaComponent implements OnInit {

  @Output("onListaSelect") onListaSelect = new EventEmitter<ListaInspeccion>();
  listasInspeccion: ListaInspeccion[];
  listaSecundaria: ListaInspeccion[];

  topLimit = 10;

  loading: boolean;
  listasCargadas: boolean;

  inspeccionList: ListaInspeccion[];
  count = 0;
  filtCodigo: string;
  filtNombre: string;
  filtDescripcion: string;

  codigoFilt: string;
  nombreFilt: string;
  descripcionFilt: string;
  filtroToogle: boolean = false;
  rotarIcon: string='rotate(0deg)';

  constructor(
    private offlineService: OfflineService,
  ) { }

  ngOnInit() {
    this.cargarListas();
  }

  cargarListas() {
    this.loading = true;
    this.listasCargadas = null;
    this.offlineService.queryListasInspeccion()
      .then(resp => {
        // this.listasInspeccion = resp['data'];
        // this.loading = false;
        // this.listasCargadas = true;
        this.listaSecundaria=[];
        this.listaSecundaria = resp['data'];
        this.loading = false;
        this.listasCargadas = true;
        this.listasInspeccion = this.listaSecundaria.slice(0,this.topLimit);
      })
      .catch(err => {
        this.loading = false;
        this.listasCargadas = false;
      });
  }

  seleccionarLista(lista) {
    this.onListaSelect.emit(lista);
  }

  
  filtrarCodigo(event) {
    this.inspeccionList = [];
    this.count = 0;
    this.filtCodigo = event.detail.value;
    this.filtrar();
  }

  filtrarNombre(event) {
    this.inspeccionList = [];
    this.count = 0;
    this.filtNombre = event.detail.value;
    this.filtrar();
    InspeccionNoProgramadaComponent;
  }

  
  filtrarDescripcion(event) {
    this.inspeccionList = [];
    this.count = 0;
    this.filtDescripcion = event.detail.value;
    this.filtrar();
  }


  filtrar(){
    this.loading = true;
    let filterQuery = new FilterQuery();
    filterQuery.sortField = "nombre";
    filterQuery.count = true;
    filterQuery.sortOrder = 1;
    filterQuery.offset = 0 + this.count;
    // filterQuery.rows = 10 ;
    
    
    filterQuery.fieldList = ['nombre','codigo','descripcion','estado'];

    filterQuery.filterList = [];

    filterQuery.filterList.push({
      criteria: Criteria.NOT_EQUALS,
      field: "estado",
      value1: "inactivo"});

    
    if (this.filtCodigo != null && this.filtCodigo.length > 0) {
      filterQuery.filterList.push({
        criteria: Criteria.LIKE,
        field: "codigo",
        value1: '%' + this.filtCodigo + '%'
      });
      //console.log(filterQuery)
    }

    if (this.filtNombre != null && this.filtNombre.length > 0) {
      filterQuery.filterList.push({
        criteria: Criteria.LIKE,
        field: "nombre",
        value1: '%' + this.filtNombre + '%'
      });
      //console.log(filterQuery)
    }

    if (this.filtDescripcion != null && this.filtDescripcion.length > 0) {
      filterQuery.filterList.push({
        criteria: Criteria.LIKE,
        field: "descripcion",
        value1: '%' + this.filtDescripcion + '%'
      });
      //console.log(filterQuery)
    }
    console.log(filterQuery)
    if (filterQuery.filterList.length > 0){      
      this.cargarListasFiltro(filterQuery);
    }else{
      this.cargarListas();
    }
    
  }

  cargarListasFiltro(filterQuery: FilterQuery) {
    this.loading = true;
    this.listasCargadas = null;
    this.offlineService.queryListasInspeccionFiltro(filterQuery)
      .then(resp => {
        this.listaSecundaria=[];
        this.listaSecundaria = resp['data'];
        this.loading = false;
        this.listasCargadas = true;
        this.listasInspeccion = this.listaSecundaria.slice(0,this.topLimit);
      })
      .catch(err => {
        this.loading = false;
        this.listasCargadas = false;
      });
  }

  filtrarInspecciones(){

    this.filtroToogle = !this.filtroToogle;

    if(this.filtroToogle){
        this.rotarIcon='rotate(180deg)'
    }
    else{
        this.rotarIcon='rotate(0deg)'
    }
}

  borrarFiltros(){
    this.codigoFilt='';
    this.nombreFilt='';
    this.descripcionFilt = '';
    this.filtroInterno();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.topLimit +=10;
      event.target.complete();
      this.listasInspeccion = this.filtroInterno().slice(0,this.topLimit);
      if (this.listasInspeccion.length == this.listaSecundaria.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  filtroInterno(){
    let dataFilt =  new FiltroPipeInspeccionesLista().transform(this.listaSecundaria, this.codigoFilt, this.nombreFilt, this.descripcionFilt)
    console.log(dataFilt)
    return dataFilt;
  }

  changeFilter(){
    this.listasInspeccion = this.filtroInterno().slice(0,this.topLimit);
  }

}
