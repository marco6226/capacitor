import { Component, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Tablero } from '../../entities/tablero';
import { TableroService } from '../../services/tablero.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PanelGraficaComponent } from '../../components/panel-grafica/panel-grafica.component';
import { Kpi, KpiModel, ParametroIndicador } from '../../entities/kpi';
import { IndicadorService } from '../../services/indicador.service'
import { ModeloGrafica } from '../../entities/modelo-grafica';
import { Util } from '../../../com/utils/util';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { HTMLSanitizerService } from '../../../com/services/html-sanitizer.service';
// import * as Chart from 'chart.js';
import { Chart } from 'chart.js';

@Component({
    selector: 'sm-consultaTablero',
    templateUrl: './consulta-tablero.page.html',
    styleUrls: ['./consulta-tablero.page.scss'],
    providers: [TableroService, IndicadorService]
})
export class ConsultaTableroPage implements OnInit {


    @ViewChildren('pnlCharts', { read: ViewContainerRef }) pnlCharts: QueryList<ViewContainerRef>;

    tablerosList: Tablero[];
    tableroSelect: Tablero;
    plantilla: any;
    loading: boolean;
    tablerosCargados: boolean;

    constructor(
        private htmlSanitService:HTMLSanitizerService,
        private messageService: MensajeUsuarioService,
        private indicadorService: IndicadorService,
        private domSanitizer: DomSanitizer,
        private tableroService: TableroService,
        private router: Router,
    ) {

    }

    ngOnInit() {
        this.cargarTableros();
        this.generarcharts();
        this.generarchartstorta();
    }

    cargarTableros() {
        this.loading = true;
        this.tablerosCargados = null;
        this.tableroService.findByFilter()
            .then(resp => {
                this.tablerosList = resp['data'];
                if (this.tablerosList != null && this.tablerosList.length > 0) {
                    let tab = this.tablerosList[this.tablerosList.length - 1];
                    this.selectTablero({ detail: { value: tab } });
                }
            })
            .catch(err => {
                this.loading = false;
                this.tablerosCargados = false;
            });
    }


    navegar(url) {
        this.router.navigate([url])
    }

    selectTablero(event) {
        this.tableroSelect = event.detail.value;
        let htmlSaneado = this.htmlSanitService.runSanitizer(this.tableroSelect.plantilla);
        this.plantilla = this.domSanitizer.bypassSecurityTrustHtml(htmlSaneado);
        this.tableroSelect.kpisObj = JSON.parse(this.tableroSelect.kpis);
        this.inicializarTablero();
    }

    inicializarTablero() {
        setTimeout(() => {
            let i = 0;
            let arrayCharts = this.pnlCharts.toArray();
            let kpiList: Kpi[] = this.tableroSelect.kpisObj;
            kpiList.forEach(kpi => {
                let obj_id = kpi.modelo.obj_id;
                let element = document.getElementById(obj_id);
                if (element != null) {
                    for (let i = 0; i < element.childNodes.length; i++) {
                        (<any>element.childNodes[i]).remove();
                    }
                    let pnlGrafComp: PanelGraficaComponent = (<any>arrayCharts[i])._data.componentView.component;
                    pnlGrafComp.data = kpi.modelo.dataChart;
                    pnlGrafComp.opciones = kpi.modelo.options;
                    pnlGrafComp.chartType = kpi.modelo.chartType;
                    pnlGrafComp.parametros = kpi.modelo.parametros;
                    pnlGrafComp.resumen = kpi.modelo.resumen;
                    pnlGrafComp.hideChart = kpi.modelo.hideChart;

                    element.appendChild((<any>arrayCharts[i]).element.nativeElement);
                }
                i += 1;
            });

            this.loading = false;
            this.tablerosCargados = true;
        }, 50);
    }


    actualizarFechas(rangoFechas, kpi: Kpi, pnlCharts: PanelGraficaComponent) {
        if (rangoFechas == null)
            return;

        pnlCharts.loading = true;
        kpi.modelo.parametros.param.rangos = rangoFechas;
        this.indicadorService.consultarIndicador(kpi.modelo.parametros)
            .then((resp: ModeloGrafica) => {
                pnlCharts.loading = false;
                kpi.modelo.dataChart = resp;
            })
            .catch(err => pnlCharts.loading = false);
    }

    onChartSave(kpi: Kpi, pnlCharts: PanelGraficaComponent) {
        pnlCharts.loading = true;
        this.indicadorService.actualizarKpi(kpi)
            .then(resp => {
                pnlCharts.loading = false;
                this.messageService.showMessage({
                    tipoMensaje: 'success',
                    mensaje: 'DATOS ACTUALIZADOS',
                    detalle: 'Se han actualizado correctamente los datos'
                });
            })
            .catch(err => pnlCharts.loading = false);
    }

    refresh(kpi: Kpi, parametros: ParametroIndicador, pnlCharts: PanelGraficaComponent) {
        pnlCharts.loading = true;
        this.indicadorService.consultarIndicador(parametros)
            .then((resp: ModeloGrafica) => {
                kpi.modelo.dataChart = resp;
                pnlCharts.loading = false;
            })
            .catch(err => pnlCharts.loading = false);
    }

    generarcharts(){
        const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
    }
    generarchartstorta(){
        const ctx = document.getElementById('torta');
const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
    }

}