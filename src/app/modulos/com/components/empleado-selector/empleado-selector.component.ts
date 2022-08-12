import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormsModule } from '@angular/forms';
import { Empleado } from '../../../emp/entities/empleado';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
    selector: 'sm-empleado-selector',
    templateUrl: './empleado-selector.component.html',
    styleUrls: ['./empleado-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EmpleadoSelectorComponent),
            multi: true,
        },
    ],
})
export class EmpleadoSelectorComponent implements OnInit, ControlValueAccessor {
    @Input() _value: Empleado;
    @Input('readOnly') disabled: boolean;
    @Input() cargar: boolean;
    @Output('changeSelection') onSelect = new EventEmitter<any>();
    propagateChange = (_: any) => {};
    empleadosList: Empleado[];
    suggestions: any[];

    constructor(public empleadoService: EmpleadoService) {}

    ngOnInit() {
        // this.empleadoService.buscar('1').then((data) => (this.empleadosList = <Empleado[]>data));
    }

    writeValue(value: Empleado) {
        this.value = value;
    }

    registerOnTouched() {}

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.propagateChange(this._value);
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

  

    // Component methods
    buscarEmpleado(event) {
        console.log('INGRESADO: ' + event.query);
        this.empleadoService.buscar(event.query).then((data) => (this.empleadosList = <Empleado[]>data));
        // let name = this.empleadoService.buscar('1002201053');
        // console.log(name);
        // console.log(this.empleadosList[0].primerNombre);
    }

    onSelection(event) {
        this.value = event;
        this.onSelect.emit(this.value);
    }

    resetEmpleado() {
        if (!this.disabled) {
            this.value = null;
        }
    }
    
    changeSelection(event: Event){
        console.log(event);
        this.onSelect.emit(event);
    }

    ok(){
        console.log("ok",this.empleadosList,this._value)
        console.log(this.empleadoService)
        // console.log(empleado)
    }
}
