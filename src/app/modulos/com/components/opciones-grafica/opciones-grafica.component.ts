import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Util } from '../../../com/utils/util'
import { ModalController } from '@ionic/angular';
import { RangoFechas } from '../../../ind/entities/kpi';

@Component({
    selector: 'sm-opcionesGrafica',
    templateUrl: './opciones-grafica.component.html',
    styleUrls: ['./opciones-grafica.component.scss']
})
export class OpcionesGraficaComponent implements OnInit {

    @Output('onchange') onchange = new EventEmitter();
    fechaActual = new Date();
    yearRange: string = (this.fechaActual.getFullYear() - 10) + ":" + this.fechaActual.getFullYear();
    fechaDesde: Date;
    fechaHasta: Date;
    nombreRango: string;

    rangosList: RangoFechas[];
    rangosInicialesList: RangoFechas[];

    datasets: any[];

    // localeES: any = locale_es;
    idxRangoEdit = -1;

    constructor(
        private modalController: ModalController
    ) { }

    ngOnInit() {
        this.modalController.getTop()
            .then(data => {
                this.rangosList = (<any>data).componentProps.rangosList;
                this.rangosInicialesList = this.rangosList;
                this.datasets = (<any>data).componentProps.data.datasets;
                this.construirRangosUI();
            });
    }

    construirRangosUI(rangoNuevo?: any) {
        if (this.rangosList == null) {
            this.rangosList = [];
        }
        if (this.rangosList.length == 0) {
            this.rangosList.push(rangoNuevo);
            return;
        }
        for (let i = 0; i < this.rangosList.length; i++) {
            let rangoAnterior = (i == 0 ? null : this.rangosList[i]);
            let rango = this.rangosList[i];
            let rangoSiguiente = (i == this.rangosList.length - 1 ? null : this.rangosList[i + 1]);

            if (rangoNuevo == null) {
                continue;
            }
            if (rangoNuevo.desde >= rango.desde && (rangoSiguiente == null || rangoNuevo.desde <= rangoSiguiente.desde)) {
                this.rangosList.splice(i + 1, 0, rangoNuevo);
                break;
            } else if (rangoNuevo.desde <= rango.desde && (rangoAnterior == null || rangoNuevo.desde >= rangoAnterior.desde)) {
                this.rangosList.splice(i, 0, rangoNuevo);
                break;
            }
        }
    }


    adicionarNuevoRango() {
        let rangoNuevo: RangoFechas = { desde: this.fechaDesde, hasta: this.fechaHasta, nombre: this.nombreRango };
        if (this.rangosList == null) {
            this.rangosList = [];
            this.rangosList.push(rangoNuevo);
        } else if (this.rangosList.length == 0) {
            this.rangosList.push(rangoNuevo);
        } else {
            this.construirRangosUI(rangoNuevo);
        }

        this.fechaDesde = null;
        this.fechaHasta = null;
        this.onchange.emit(this.rangosList);
    }
    removerRango(index: number) {
        if (this.rangosList.length == 1) {
            return;
        }
        this.rangosList.splice(index, 1);
        this.onchange.emit(this.rangosList);
    }

    cambiarColor(event: any) {
        // this.onchange.emit(this.rangosList);
    }

    anterior() {
        this.modalController.dismiss();
    }

    editarRango(rango: RangoFechas, index: number) {
        this.idxRangoEdit = index;
        this.fechaDesde = rango.desde;
        this.fechaHasta = rango.hasta;
        this.nombreRango = rango.nombre;
    }

    cancelarEdicion() {
        this.idxRangoEdit = -1;
        this.fechaDesde = null;
        this.fechaHasta = null;
        this.nombreRango = null;
    }

    actualizarRango() {
        let rango = this.rangosList[this.idxRangoEdit];
        rango.desde = this.fechaDesde;
        rango.hasta = this.fechaHasta;
        rango.nombre = this.nombreRango;
        this.rangosList.splice(this.idxRangoEdit, 1);
        this.construirRangosUI(rango);
        this.cancelarEdicion();
    }

    aceptar() {
        // let cambioRango = JSON.stringify(this.rangosInicialesList) != JSON.stringify(this.rangosList);
        // let rangos = cambioRango ? this.rangosList : null;
        let colors = [];
        for (const ds of this.datasets) {
            colors.push({ backgroundColor: ds.backgroundColor, borderColor: ds.backgroundColor });
        }
        this.modalController.dismiss({ rango: this.rangosList, colors: colors });
    }

}
