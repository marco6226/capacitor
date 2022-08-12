import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../modulos/com/services/sesion.service';
import { Market } from '@ionic-native/market/ngx';
import { AuthService } from '../modulos/com/services/auth.service';

@Component({
  selector: 'sm-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [Market]
})
export class HomePage {

  nombreInp: string;
  nombreAuc: string;
  nombreCop: string;
  nombreSec: string;
  nombreInd: string;

  version: string;
  versionDisponible: string;

  constructor(
    private authService: AuthService,
    private sessionService: SesionService,
    private router: Router,
    public market: Market,
  ) {
    this.nombreInp = this.sessionService.getConfigParam('NOMB_MOD_INP');
    this.nombreAuc = this.sessionService.getConfigParam('NOMB_MOD_AUC');
    this.nombreCop = this.sessionService.getConfigParam('NOMB_MOD_COP');
    this.nombreSec = this.sessionService.getConfigParam('NOMB_MOD_SEC');
    this.nombreInd = this.sessionService.getConfigParam('NOMB_MOD_IND');
    this.authService.consultarUpdateDisponible()
      .then(resp => {
        this.version = resp['versionActual'];
        this.versionDisponible = resp['versionDisponible'];
      });
  }
  navegar(url) {
    this.router.navigate([url])
  }

  actualizar() {
    let so = localStorage.getItem('plataforma');
    if (so == 'android') {
      this.market.open('co.sigess.app');
    } else if (so == 'ios') {
      this.market.open('1562431304');
    } else {
      alert("Plataforma no detectada");
    }
  }
}
