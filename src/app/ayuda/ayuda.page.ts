import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../modulos/com/services/sesion.service';
import { Market } from '@ionic-native/market/ngx';
import { ManualService } from '../modulos/com/services/manual.service';
import { Manual } from '../modulos/com/entities/manual';
import { LoadingController } from '@ionic/angular';
import { File as FilePlugin, FileEntry } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { MensajeUsuarioService } from '../modulos/com/services/mensaje-usuario.service';
import { AuthService } from '../modulos/com/services/auth.service';
import { OfflineService } from '../modulos/com/services/offline.service';

@Component({
  selector: 'sm-ayuda',
  templateUrl: 'ayuda.page.html',
  styleUrls: ['ayuda.page.scss'],
  providers: [Market, ManualService, FilePlugin, FileOpener]
})
export class AyudaPage {

  manuales: Manual;
  loading: boolean;
  cargaExitosa: boolean;
  rutaVideo: string;

  version: string;
  versionDisponible: string;

  constructor(
    public offlineService: OfflineService,
    public authService: AuthService,
    public msgService: MensajeUsuarioService,
    public file: FilePlugin,
    public fileOpener: FileOpener,
    public loadingController: LoadingController,
    public sessionService: SesionService,
    public router: Router,
    public manualService: ManualService,
    public market: Market
  ) {
    this.authService.consultarUpdateDisponible()
      .then(resp => {
        this.version = resp['versionActual'];
        this.versionDisponible = resp['versionDisponible'];
      });
    this.cargarManuales();
  }

  cargarManuales() {
    this.loading = true;
    this.cargaExitosa = null;
    this.offlineService.queryManualesPorUsuario()
      .then((resp: any) => {
        this.manuales = resp.data;
        this.loading = false;
        this.cargaExitosa = true;
      })
      .catch(err => {
        this.loading = false;
        this.cargaExitosa = false;
      });

  }

  navegar(url) {
    if (this.rutaVideo == null) {
      this.router.navigate([url])
    } else {
      this.rutaVideo = null;
    }
  }

  abrir(man: Manual) {
    this.rutaVideo = null;
    let workingPath = this.file.dataDirectory;
    let fileName = man.id + "_" + man.codigo + "." + man.tipo;
    let loading = this.showLoading('Accediendo al manual...');

    let codManAnt = localStorage.getItem('man_' + man.id);
    if (man.codigo != codManAnt) {
      let oldFileName = man.id + "_" + codManAnt + "." + man.tipo;
      this.file.removeFile(workingPath, oldFileName)
        .then(() => {
          this.descargarManual(man, workingPath, fileName, loading);
        })
        .catch(err => {
          this.descargarManual(man, workingPath, fileName, loading);
        });
    } else {
      this.file.checkFile(workingPath, fileName)
        .then(exist => {
          return this.file.resolveDirectoryUrl(workingPath)
        })
        .then(dirEntry => {
          return this.file.getFile(dirEntry, fileName, null);
        })
        .then(fileEntry => {
          return fileEntry.file(fp => {
            loading.then(loadPop => {
              loadPop.dismiss();
              this.openFile(man, fileEntry, fp.type)
            });
          });
        })
        .catch(err => {
          this.descargarManual(man, workingPath, fileName, loading);
        });
    }
  }

  descargarManual(man: Manual, workingPath: string, fileName: string, loading: any) {
    this.manualService.descargar(man)
      .then(resp => {
        var blob = new Blob([<any>resp]);
        return this.file.writeFile(workingPath, fileName, blob, { replace: true });
      })
      .then((fileEntry: FileEntry) => {
        return fileEntry.file(file => {
          loading.then(loadPop => {
            loadPop.dismiss();
            localStorage.setItem('man_' + man.id, man.codigo);
            this.openFile(man, fileEntry, file.type);
          });
        })
      })
      .catch(err => {
        loading.then(loadPop => loadPop.dismiss())
      })
  }

  openFile(man: Manual, fileEntry, type: string) {
    if (man.tipo == 'mp4' || man.tipo == 'webm') {
      this.rutaVideo = (<any>window).Ionic.WebView.convertFileSrc(fileEntry.toURL());
    } else {
      this.fileOpener.open(fileEntry.toURL(), type).catch(
        err => this.msgService.showMessage({
          tipoMensaje: 'info', mensaje: 'No ha sido posible visualizar el manual',
          detalle: "No existe una aplicacion para abrir " + fileEntry.name + "."
        })
      )
    }

  }

  async showLoading(msg: string) {
    const loading = await this.loadingController.create({
      message: msg,
      translucent: true,
    });
    await loading.present();
    return loading;
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
