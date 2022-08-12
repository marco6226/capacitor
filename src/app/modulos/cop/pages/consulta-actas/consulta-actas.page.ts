import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { Directorio } from '../../../ado/entities/directorio';
import { OfflineService } from '../../../com/services/offline.service';
import { DirectorioService } from '../../../ado/services/directorio.service';

import { File as FilePlugin, FileEntry } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController } from '@ionic/angular';
import { ActaFormComponent } from '../../components/acta-form/acta-form.component';
import { FilterQuery } from '../../../com/entities/filter-query';
import { Acta } from '../../entities/acta';
import { StorageService } from '../../../com/services/storage.service';
import { ActaService } from '../../services/acta.service';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';

@Component({
  selector: 'sm-consultaActas',
  templateUrl: './consulta-actas.page.html',
  styleUrls: ['./consulta-actas.page.scss'],
  providers: [
    OfflineService,
    DirectorioService,
    FileOpener,
    FilePlugin,
    Camera,
  ]
})
export class ConsultaActasPage implements OnInit {

  options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 960,
    targetHeight: 960,
  }

  actasList: Acta[];
  actasLocales: Acta[];
  loading: boolean;
  actasCargadas: boolean;

  visibleAdd: boolean;

  constructor(
    private msgService: MensajeUsuarioService,
    private actaService: ActaService,
    private storageService: StorageService,
    private modalController: ModalController,
    private camera: Camera,
    public offlineService: OfflineService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    let permMap: any = this.offlineService.sessionService.getPermisosMap();
    this.visibleAdd = (permMap['COP_POST_ACT'] != null && permMap['COP_POST_ACT'].valido == true) && (permMap['COP_POST_DOCACT'] != null && permMap['COP_POST_DOCACT'].valido == true);
    this.storageService.getSyncActasCopasst()
      .then(resp => {
        this.actasLocales = resp['data']
      });
    this.cargarActas();
  }

  cargarActas() {
    this.loading = true;
    this.actasCargadas = null;
    this.offlineService.queryActasCopasst()
      .then(resp => {
        this.actasList = [];
        (<any[]>resp['data']).forEach(dto => {
          this.actasList.push(FilterQuery.dtoToObject(dto));
        });
        this.loading = false;
        this.actasCargadas = true;
      })
      .catch(err => {
        this.loading = false;
        this.actasCargadas = false;
      });
  }

  async abrirDlgForm() {
    const modal = await this.modalController.create({
      component: ActaFormComponent,
      cssClass: "modal-fullscreen"
    });
    modal.onDidDismiss().then(
      resp => this.onModalDismiss(<Acta>resp.data)
    );
    return await modal.present();
  }

  onModalDismiss(acta: Acta) {
    if (acta == null) {
      return;
    }
    if (acta.id == null) {
      this.actasLocales.unshift(acta);
    } else {
      this.actasList.unshift(acta);
    }
  }

  async abrirModal(acta) {
    const modal = await this.modalController.create({
      component: ActaFormComponent,
      componentProps: { value: acta },
    });
    return await modal.present();
  }

  navegar(url) {
    this.router.navigate([url])
  }

  sincronizar(acta: Acta, idx: number) {
    acta['sync'] = true;
    this.actaService.subirActa(acta, acta['documentos'])
      .then((resp: Acta) => {
        acta['sync'] = false;
        // Retira del listado de actas por sincronizar
        this.actasLocales.splice(idx, 1);
        this.storageService.borrarSyncActasCopasst(acta);
        // Adiciona el acta al listado de actas creadas y si está en modo offline la adiciona en el espacio local
        this.actasList.unshift(resp);
        if (this.offlineService.getOfflineMode())
          this.storageService.setActasCopasst([resp]);
        // Despliega mensaje de confirmación
        this.msgService.showMessage({
          tipoMensaje: 'success', mensaje: 'ACTA SINCRONIZADA',
          detalle: "Se ha sincronizado correctamente el acta  " + acta.nombre
        });
      })
      .catch(err => {
        acta['sync'] = false;
      });
  }
}



export interface ArchivoLocal {
  documentoId?: string;
  nombre: string,
  fechaCreacion: Date,
  ext: string,
  url: string,
  alias?: string;
  descripcion?: string;
}