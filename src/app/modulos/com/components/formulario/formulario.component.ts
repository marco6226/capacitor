import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Formulario } from '../../entities/formulario'
import { RespuestaCampo } from '../../entities/respuesta-campo';

@Component({
  selector: 'sm-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {

  @Input("formularioModel") formulario: Formulario;
  form: FormGroup;
  selectorsMap: any = [];
  @Output("onValidChange") onValidChange = new EventEmitter<boolean>();
  @Output("onsubmit") onsubmit = new EventEmitter<any>();

  @Input("respuestasList") respuestasList: any[];

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    console.log("Constructor formulario...");
    let respMap = {};
    if (this.respuestasList != null) {
      this.respuestasList.forEach(resp => {
        respMap[resp.campoId] = resp.valor;
      });
    }

    let group: any = {};
    this.formulario.campoList.forEach(campo => {
      if (campo.tipo == 'multiple_select' || campo.tipo == 'single_select') {
        this.selectorsMap[campo.id] = (campo.tipo == 'single_select' ? [{ label: '--seleccione--', value: null }] : []);
        campo.opciones.forEach(opcion => {
          this.selectorsMap[campo.id].push({ label: opcion, value: opcion });
        });
      }

      if (respMap[campo.id] != null) {
        campo.respuestaCampo = new RespuestaCampo();
        campo.respuestaCampo.campoId = campo.id;
        campo.respuestaCampo.valor = respMap[campo.id];
      }

      if (campo.respuestaCampo != null) {
        switch (campo.tipo) {
          case 'timestamp':
          case 'date':
            campo.respuestaCampo.valor = campo.respuestaCampo.valor == null ? null : new Date(campo.respuestaCampo.valor).toISOString();
            break;
          case 'multiple_select':
            campo.respuestaCampo.valor = campo.respuestaCampo.valor == null ? null : <string[]>(campo.respuestaCampo.valor.split(";"));
            break;
          case 'single_select':
          case 'text':
          case 'boolean':
            campo.respuestaCampo.valor = campo.respuestaCampo.valor;
            break;
        }
      } else {
        campo.respuestaCampo = new RespuestaCampo();
      }
      let formControl = campo.requerido ? new FormControl(campo.respuestaCampo.valor, Validators.required) : new FormControl(campo.respuestaCampo.valor);
      formControl.valueChanges.subscribe(
        data => {
          campo.respuestaCampo.valor = data;
          this.form.updateValueAndValidity();
          this.onValidChange.emit(this.form.valid);
        }
      );
      group[campo.id + "_" + campo.nombre] = formControl;
    });
    this.form = new FormGroup(group);
    this.onValidChange.emit(this.form.valid);
  }

  formatearValorFecha(event, campo: string) {
    let valor = event.detail.value;
    let isoDate =
      (valor.year == null ? '00' : valor.year.text) +
      '-' + (valor.month == null ? '00' : valor.month.value) +
      '-' + (valor.day == null ? '00' : valor.day.text) +
      'T' + (valor.hour == null ? '00' : valor.hour.text) +
      ':' + (valor.minute == null ? '00' : valor.minute.text);
    this.form.controls[campo['nombre']].setValue(new Date(isoDate));
  }

  aceptar() {
    this.onsubmit.emit(this.form.value);
  }

}