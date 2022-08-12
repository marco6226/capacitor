import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { endPoints } from '../../../../environments/environment';
import { Empleado } from '../../emp/entities/empleado';
import { HttpInt } from './http-int.service';
import { MensajeUsuarioService } from './mensaje-usuario.service';
import { ServiceCRUD } from './service-crud.service';
import { SesionService } from './sesion.service';
import 'rxjs/operators';
import { map } from 'rxjs/operators';
import { FilterQuery } from '../entities/filter-query';
@Injectable()
export class EmpleadoService extends ServiceCRUD<Empleado> {
    httpInt;
    headers;

    fields: string[] = [
        'id',
        'primerNombre',
        'segundoNombre',
        'primerApellido',
        'segundoApellido',
        'numeroIdentificacion',
        'cargo_nombre',
        'usuario_email',
        'usuario_icon',
        'area_nombre',
        'estado',
    ];
    empleadosList: Empleado[];


    constructor(router: Router, httpInt: HttpInt, mensajeUsuarioService: MensajeUsuarioService, private http: HttpClient, public sesionService: SesionService) {
        super(router, httpInt, mensajeUsuarioService);
    }

    /**
     * Modifica los datos de usuario por parte del mismo empleado.
     * No es permitido que un usuario modifique datos de otro a través
     * éste servicio
     * @param entity
     */
    edit(entity: Empleado) {
        let body = JSON.stringify(entity);
        return new Promise((resolve) => {
            this.httpInt
                .put(this.end_point + 'update', body)
                .map((res) => res)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    loadAll(list: Empleado[]) {
        let body = JSON.stringify(list);
        return new Promise((resolve) => {
            this.httpInt
                .put(this.end_point + 'loadAll', body)
                .map((res) => res)
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    buscar(parametro: string) {
        return new Promise((resolve) => {
            this.httpInt
                .get(endPoints.EmpleadoService + 'buscar/' + parametro)
                .pipe(map((res) => res))
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (err) => this.manageError(err)
                );
        });
    }

    getClassName(): string {
        return 'EmpleadoService';
    }

    public getInspeccionImagen(empleado_id) {
        return this.http.get(`${this.end_point}images/${empleado_id}`, this.getRequestHeaders(this.headers)).toPromise();
    }

    getRequestHeaders(headers?: HttpHeaders): any {
        if (headers == null) headers = new HttpHeaders().set('Content-Type', 'application/json');

        headers = headers.set('Param-Emp', this.sesionService.getParamEmp()).set('app-version', this.sesionService.getAppVersion()).set('Authorization', this.sesionService.getBearerAuthToken());
        return { headers: headers };
    }

    public getFirma(empleado_id) {
        return this.http.get(`${this.end_point}images/${empleado_id}`, this.getRequestHeaders(this.headers)).toPromise();
      }

    findempleadoByUsuario(parametro: string) {
        return new Promise(resolve => {
          this.httpInt.get(endPoints.EmpleadoService + "buscarempleado/" + parametro)
            .map(res => res)
            .subscribe(
              res => {
                resolve(res);
              }
              ,
              err => this.manageError(err)
            )
        });
      }

      async getResults(term: any){
          console.log(term)
          if(term.length > 2){
            await this.lazyLoad();
            console.log(this.empleadosList)
                  
        this.empleadosList = this.empleadosList.filter(item=>{
          if(item.primerNombre!=null){

            if(item.primerNombre.toLowerCase().includes(term.toLowerCase()) 
                || item.primerApellido.toLowerCase().includes(term.toLowerCase())
                || item.usuario.email.toLowerCase().includes(term.toLowerCase())
                || item.numeroIdentificacion.toString().includes(term.toLowerCase())){
                return true;
            }
            else{
                return false;
            }

            // return (item.primerNombre.toLowerCase().includes(term.toLowerCase()) 
            //         || item.segundoNombre.toLowerCase().includes(term.toLowerCase()) )
                    // item.primerApellido.toLowerCase().includes(term.toLowerCase()) ||
                    // item.segundoApellido.toLowerCase().includes(term.toLowerCase()) ||
                    // item.numeroIdentificacion.toLowerCase().includes(term.toLowerCase())
                    // item.usuario.email.toLowerCase().includes(term.toLowerCase())

          }else{
            //   return this.empleadosList;
          }
        }) 
    }
    console.log(this.empleadosList)
        return this.empleadosList;
      }

      getItemLabel(item: any){
          return item.primerNombre + " "+ item.primerApellido;
      }

      lazyLoad() {
        // this.loading = true;
        let filterQuery = new FilterQuery();
        // filterQuery.sortField = event.sortField;
        // filterQuery.sortOrder = event.sortOrder;
        // filterQuery.offset = event.first;
        // filterQuery.rows = event.rows;
        filterQuery.count = true;

        filterQuery.fieldList = this.fields;
        // filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

        return this.findByFilter(filterQuery).then(
            resp => {
                // this.totalRecords = resp['count'];
                // this.loading = false;
                this.empleadosList = [];
                (<any[]>resp['data']).forEach(dto => this.empleadosList.push(FilterQuery.dtoToObject(dto)));
            }
        );
        // return this.empleadosList;
    }
}
