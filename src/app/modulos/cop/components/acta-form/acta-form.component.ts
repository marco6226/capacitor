import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Area } from '../../../emp/entities/area';
import { OfflineService } from '../../../com/services/offline.service';
import { Acta } from '../../entities/acta';
import { ArchivoLocal } from '../../pages/consulta-actas/consulta-actas.page';
import { Util } from '../../../com/utils/util';
import { File as FilePlugin, FileEntry } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { ActaService } from '../../services/acta.service';
import { DirectorioService } from '../../../ado/services/directorio.service';
import { StorageService } from '../../../com/services/storage.service';
import { Directorio } from '../../../ado/entities/directorio';

@Component({
  selector: 'sm-actaForm',
  templateUrl: './acta-form.component.html',
  styleUrls: ['./acta-form.component.scss'],
  providers: [FileOpener, FilePlugin]
})
export class ActaFormComponent implements OnInit {

  options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 960,
    targetHeight: 960,
  }


  @ViewChild('fileChooser') fileChooser: HTMLInputElement;

  archivosList: ArchivoLocal[];
  nombre: string;
  descripcion: string;
  area: Area;
  esConsulta: boolean;
  guardando: boolean;
  loading: boolean;
  areasCargadas: boolean;

  areasList: Area[];

  constructor(
    private loadingController: LoadingController,
    private storageService: StorageService,
    private dirService: DirectorioService,
    private actaService: ActaService,
    private msgService: MensajeUsuarioService,
    private camera: Camera,
    private file: FilePlugin,
    public offlineService: OfflineService,
    public alertController: AlertController,
    public modalController: ModalController,
    private fileOpener: FileOpener,
  ) {

  }

  ngOnInit() {
    this.modalController.getTop()
      .then(data => {
        if (data.componentProps != null) {
          let acta = (<any>data).componentProps.value
          this.esConsulta = true;
          this.nombre = acta.nombre;
          this.descripcion = acta.descripcion;
          this.area = acta.area;
          acta.documentosList.forEach(doc => {
            if (this.archivosList == null)
              this.archivosList = [];

            let arch = {
              nombre: doc.nombre,
              ext: Util.getExtension(doc.nombre),
              url: null,
              fechaCreacion: null,
              alias: doc.nombre
            };
            arch['docId'] = doc.id;
            this.archivosList.push(arch);
          });
        } else {
          // this.cargarAreas();
        }
      });
  }

  // cargarAreas() {
  //   this.loading = true;
  //   this.areasCargadas = null;
  //   this.offlineService.queryArea()
  //     .then(resp => {
  //       this.areasList = <any>resp['data'];
  //       this.loading = false;
  //       this.areasCargadas = true;
  //     })
  //     .catch(err => {
  //       this.loading = false;
  //       this.areasCargadas = false;
  //     });
  // }

  async salir() {
    if (this.esConsulta) {
      this.modalController.dismiss();
      return;
    }
    const alert = await this.alertController.create({
      header: '¿Desea salir?',
      message: 'El acta no ha sido guardada, los datos serán descartados. ¿Confirma esta acción?',
      buttons: [{
        text: 'Si',
        handler: () => {
          this.modalController.dismiss();
        }
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'No'
      }]
    });
    await alert.present();
  }

  /* ********************** DOCUMENTOS ****************************** */
  openFileChooser() {
    (<any>this.fileChooser).nativeElement.click();
  }

  onFileSelect(file: FileList) {
    Util.readBlobFile(file.item(0)).then(blob => {
      let f = Util.blobToFile(blob, file.item(0).name);
      this.guardarArchivoLocal(f, f.name);
    });
  }

  getPicture() {
    this.camera.getPicture(this.options)
      .then(imageData => {
        let pathFile = (<string>imageData);
        let lastIndex = pathFile.lastIndexOf("/");
        let fileName = pathFile.substring(lastIndex + 1, pathFile.length);

        let url = (<any>window).Ionic.WebView.convertFileSrc(imageData);
        Util.dataURLtoFile(url, fileName).then(
          file => this.guardarArchivoLocal(file, fileName)
        );
      });
  }

  guardarArchivoLocal(fileParam: File, fileName: string) {
    let dirPath = this.file.dataDirectory;
    this.file.writeFile(dirPath, fileName, fileParam, { replace: true })
      .then(fileEntry => {
        let fe = <FileEntry>fileEntry;
        let dir: ArchivoLocal = {
          nombre: fileName,
          fechaCreacion: new Date(),
          ext: Util.getExtension(fileName),
          url: (<any>window).Ionic.WebView.convertFileSrc(fe.nativeURL),
          alias: fileName.split(".")[0]
        };
        if (this.archivosList == null) {
          this.archivosList = [];
        }
        this.archivosList.unshift(dir);
      });
  }

  visualizar(doc: ArchivoLocal) {
    let filePath = this.file.dataDirectory;
    this.file.checkFile(filePath, doc.nombre)
      .then(exist => {
        return this.file.resolveDirectoryUrl(filePath)
      })
      .then(dirEntry => {
        return this.file.getFile(dirEntry, doc.nombre, null);
      })
      .then(fileEntry => {
        return fileEntry.file(fp => this.openFile(fileEntry, fp.type));
      })
      .catch(err => {
        this.downloadFile(doc['docId'], filePath, doc.nombre);
      });
  }

  async removerDoc(doc: ArchivoLocal, index: number) {
    const alert = await this.alertController.create({
      header: '¿Retirar documento?',
      message: 'El documento ' + doc.alias + ' será retirado. ¿Confirma esta acción?',
      buttons: [{
        text: 'Si',
        handler: () => {
          let dirPath = this.file.dataDirectory;
          this.archivosList.splice(index, 1);
          this.file.removeFile(dirPath, doc.nombre);
        }
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'No'
      }]
    });
    await alert.present();
  }

  downloadFile(idDocumento: string, workingPath: string, fileName) {
    let loading = this.showLoading('Descargando archivo...');
    this.dirService.download(idDocumento, 'cop')
      .then(resp => {
        var blob = new Blob([<any>resp]);
        return this.file.writeFile(workingPath, fileName, blob, { replace: true });
      })
      .then((fileEntry: FileEntry) => {
        return fileEntry.file(file => loading
          .then(loadPop => {
            loadPop.dismiss();
            this.openFile(fileEntry, file.type);
          })
        )
      })
      .catch(err => {
        loading.then(loadPop => loadPop.dismiss())
      });
  }

  openFile(fileEntry, type: string) {
    this.fileOpener.open(fileEntry.toURL(), type).catch(
      err => this.msgService.showMessage({
        tipoMensaje: 'info', mensaje: 'No ha sido posible visualizar el archivo',
        detalle: "No existe una aplicacion para abrir " + fileEntry.name + "."
      })
    )
  }

  async showLoading(msg: string) {
    const loading = await this.loadingController.create({
      message: msg,
      translucent: true,
    });
    await loading.present();
    return loading;
  }

  /*************** PERSISTENCIA ************* */



  guardarActa() {
    let acta = new Acta();
    acta.nombre = this.nombre;
    acta.descripcion = this.descripcion;
    acta.area = this.area;
    this.guardando = true;
    this.persistirActa(acta)
      .then(acta => {
        this.guardando = false;
        this.modalController.dismiss(acta).then(
          resp => this.msgService.showMessage({
            tipoMensaje: 'success',
            mensaje: 'ACTA REGISTRADA',
            detalle: 'Se ha registrado correctamente el acta'
          })
        );
      })
      .catch(err => {
        this.guardando = false;
      });
  }


  persistirActa(acta: Acta) {
    if (this.offlineService.getOfflineMode()) {
      return new Promise((resolve, reject) => {
        acta['documentos'] = this.archivosList;
        acta.fechaElaboracion = new Date();
        acta['hashId'] = acta.fechaElaboracion.toISOString();
        this.storageService.guardarSyncActaCopasst(acta)
          .then(() => {
            resolve(acta)
          });
      });
    } else {
      return this.actaService.subirActa(acta, this.archivosList);
    }
  }

}