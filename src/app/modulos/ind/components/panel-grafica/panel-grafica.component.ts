import { Component, OnDestroy, ViewChild, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { Chart } from 'chart.js';
import { ModeloGrafica } from '../../entities/modelo-grafica';
import { ParametroIndicador, Kpi, KpiModel } from '../../entities/kpi';
import { OpcionesGraficaComponent } from '../../../com/components/opciones-grafica/opciones-grafica.component';
import { ModalController } from '@ionic/angular';
import { Util } from '../../../com/utils/util';


@Component({
  selector: 'sm-panelGrafica',
  templateUrl: './panel-grafica.component.html',
  styleUrls: ['./panel-grafica.component.scss']
})
export class PanelGraficaComponent implements OnInit {

  @ViewChild("canvas") canvas: ElementRef;
  private chart: Chart;

  @Output('onRangoFechasEvent') onRangoFechasEvent = new EventEmitter<any>();
  @Output('onSave') onSave = new EventEmitter<any>();
  @Output('onRefresh') onRefresh = new EventEmitter<any>();

  @Input('kpi') kpi: Kpi;

  _data: ModeloGrafica;
  // @Input("opciones") opciones: any;
  // @Input("chartType") chartType: string;
  // @Input("parametros") parametros: ParametroIndicador;
  // @Input("resumen") resumen: boolean;
  // @Input("hideChart") hideChart: boolean;
  // @Input("titulo") titulo: string;

  opciones: any;
  chartType: string;
  parametros: ParametroIndicador;
  resumen: boolean;
  hideChart: boolean;
  titulo: string;
  colors: any[];
  loading: boolean;

  constructor(
    private modalController: ModalController
  ) {

  }

  ngOnInit() {
    this._data = this.kpi.modelo.dataChart;
    this.opciones = this.kpi.modelo.options;
    this.chartType = this.kpi.modelo.chartType;
    this.parametros = this.kpi.modelo.parametros;
    this.resumen = this.kpi.modelo.resumen;
    this.hideChart = this.kpi.modelo.hideChart;
    this.titulo = this.kpi.modelo.titulo;
    this.colors = [];
    this._data.datasets.forEach(ds => {
      this.colors.push({ backgroundColor: ds.backgroundColor, borderColor: ds.borderColor });
    });
    this.construirGrafica();
  }

  construirGrafica() {
    if (this.opciones == null) {
      this.opciones = {
        legend: {
          position: 'bottom'
        },
        scales: {
          yAxes: [{ display: true, ticks: { suggestedMin: 0 } }]
        }
      };
    }
    setTimeout(() => {
      if (this.hideChart == false) {
        this.chart = new Chart(this.canvas.nativeElement, {
          type: this.chartType,
          data: {
            labels: this._data.labels,
            datasets: this._data.datasets
          },
          options: this.opciones
        });
      }
    }, 80);
  }

  onSaveClick() {
    this.kpi.modelo.dataChart = this._data;
    this.kpi.modelo.options = this.opciones;
    this.kpi.modelo.chartType = this.chartType;
    this.kpi.modelo.parametros = this.parametros;
    this.kpi.modelo.resumen = this.resumen;
    this.kpi.modelo.hideChart = this.hideChart;
    this.kpi.modelo.titulo = this.titulo;
    for (const ds of this.kpi.modelo.dataChart.datasets) {
      delete ds['_meta'];
    }
    this.onSave.emit(this.kpi);
  }

  async abrirDlg() {
    const modal = await this.modalController.create({
      component: OpcionesGraficaComponent,
      componentProps: { rangosList: this.parametros.param.rangos, data: this._data }
    });
    modal.onDidDismiss()
      .then(resp => {
        if (resp.data != null) {
          this.onRangoFechasEvent.emit(resp.data.rango);
          this.colors = resp.data.colors;
        }
      })
    return await modal.present();
  }

  refresh() {
    this.onRefresh.emit(this.parametros);
  }

  @Input('data') set data(data: ModeloGrafica) {
    this._data = data;
    if (this.chart != null) {
      this.chart.data.labels = this._data.labels;
      this.chart.data.datasets = this._data.datasets;
    }
    for (let i = 0; i < this._data.datasets.length; i++) {
      let backgroundColor = this.colors == null || this.colors[i] == null ? Util.randomColor() : this.colors[i].backgroundColor;
      if (this._data.datasets[i].backgroundColor == null) {
        this._data.datasets[i].borderColor = backgroundColor;
        this._data.datasets[i].backgroundColor = backgroundColor;
      }
      if (this.chart != null && this.chart.data.datasets[i].backgroundColor == null) {
        this.chart.data.datasets[i].borderColor = backgroundColor;
        this.chart.data.datasets[i].backgroundColor = backgroundColor;
      }
    }
    if (this.chart != null) {
      this.chart.update();
    }
  }
}

