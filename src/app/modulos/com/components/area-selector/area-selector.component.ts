import { Component, OnInit, Input, Output, EventEmitter, forwardRef, NgModule } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Area } from '../../../emp/entities/area';
import { Util } from '../../utils/util';
import { OfflineService } from '../../services/offline.service';
import { CommonModule } from '@angular/common';
import { TreeModule } from '../tree/tree.component';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'sm-areaSelector',
    templateUrl: './area-selector.component.html',
    styleUrls: ['./area-selector.component.scss'],
    providers: [
        OfflineService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AreaSelectorComponent), // replace name as appropriate
            multi: true,
        },
    ],
})
export class AreaSelectorComponent implements OnInit, ControlValueAccessor {
    // a private variable to store the value of input in our component
    @Input('ngModel') private _value: Area;
    @Output('ngModelChange') valueChange = new EventEmitter();
    @Input('appendTo') appendTo: string;

    @Input('disabled') disabled: boolean;
    @Input('areas') areas: Area[];
    areasFiltradas: Area[];

    propagateChange = (_: any) => {};

    visibleModal: boolean;
    areasCargadas: boolean;
    loading: boolean;

    constructor(public offlineService: OfflineService) {}

    ngOnInit() {
        let modal = document.getElementById('modalNode');
        document.getElementsByTagName(this.appendTo)[0].appendChild(modal);
        this.cargarAreas();
        console.log(modal)
    }

    get value(): Area {
        return this._value;
    }

    set value(v: Area) {
        if (v !== this._value) {
            this._value = v;
            this.propagateChange(this._value);
        }
    }

    writeValue(value: Area) {
        this.value = value;
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}
    /* ********************************************* */

    cargarAreas() {
        this.loading = true;
        this.areasCargadas = null;
        this.offlineService
            .queryArea()
            .then((resp) => {
                this.areas = <any>resp['data'];
                this.loading = false;
                this.areasCargadas = true;
            })
            .catch((err) => {
                this.loading = false;
                this.areasCargadas = false;
            });
    }

    openModal() {

        console.log(this.loading);
        console.log(this.areasCargadas);
        console.log(this.disabled);
        if (this.disabled == true || this.areasCargadas == false || this.loading == true) {
            return;
        }
        this.areasFiltradas = null;
        this.visibleModal = true;
        if (this.value != null) {
            this.cargarValor(this.areas, this.value);
            console.log(this.areas);
            console.log(this.value);
        }
    }

    cargarValor(areas: Area[], areaSelect: Area) {
        areas.forEach((area) => {
            area['selected'] = area.id == this.value.id;
            if (area.areaList != null) {
                this.cargarValor(area.areaList, areaSelect);
            }
        });
    }

    cancelar() {
        this.visibleModal = false;
        console.log(this.visibleModal);
    }

    aceptar() {
        let seleccion = [];
        if (this.areasFiltradas != null) {
            Util.getSeleccionArbol('areaList', this.areasFiltradas, seleccion, ['nombre']);
        } else {
            Util.getSeleccionArbol('areaList', this.areas, seleccion, ['nombre']);
        }
        this.value = seleccion[0];
        this.visibleModal = false;
        this.valueChange.emit(this.value);
    }

    filtrar(event: any) {
        let valor = event.detail.value;
        if (valor != null && valor != '') {
            this.areasFiltradas = [];
            this.busquedaRecursiva(this.areas, valor, this.areasFiltradas);
        } else {
            this.areasFiltradas = null;
        }
    }

    busquedaRecursiva(arbol: Area[], criterio: string, listado: Area[]) {
        arbol.forEach((area) => {
            if (area.nombre.toLowerCase().includes(criterio.toLowerCase())) {
                listado.push(area);
            }
            if (area.areaList != null) {
                this.busquedaRecursiva(area.areaList, criterio, listado);
            }
        });
    }
}

@NgModule({
    imports: [CommonModule, TreeModule, IonicModule],
    exports: [AreaSelectorComponent],
    declarations: [AreaSelectorComponent],
})
export class AreaSelectorModule {}
