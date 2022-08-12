import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ListaInspeccion } from '../../entities/lista-inspeccion';
import { ElementoInspeccion } from '../../entities/elemento-inspeccion';
import { PopoverController, NavParams } from '@ionic/angular';


@Component({
  selector: 'sm-menuLista',
  templateUrl: './menu-lista.component.html',
  styleUrls: ['./menu-lista.component.scss']
})
export class MenuListaComponent implements OnInit {

  items: any;
  contador: number = 0;
  datosGene: string;

  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    let lista = <ListaInspeccion>(this.navParams.data.listaInspeccion);
    this.items = [{
      label: lista.formulario.nombre,
      calificable: false,
      checked: false,
      indice: -1
    }];
    this.generarMenu(this.items, lista.elementoInspeccionList);
  }

  generarMenu(list: any[], elementos: ElementoInspeccion[]) {
    elementos.forEach(el => {
      let calificable = el.elementoInspeccionList == null || el.elementoInspeccionList.length == 0;
      list.push({
        label: el.codigo + ' ' + el.nombre,
        calificable: calificable,
        checked: el.calificacion != null && el.calificacion.opcionCalificacion != null,
        indice: (calificable ? this.contador : null)
      });
      if (calificable)
        this.contador += 1;
      if (el.elementoInspeccionList != null && el.elementoInspeccionList.length > 0) {
        this.generarMenu(list, el.elementoInspeccionList);
      }
    });
  }

  seleccionar(indice: number) {
    if (indice != null)
      this.popoverController.dismiss(indice);
  }

}
