import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Desviacion } from '../../entities/desviacion';
import { OfflineService } from '../../../com/services/offline.service';
import { SistemaCausaRaiz } from '../../entities/sistema-causa-raiz';
import { SistemaCausaInmediata } from '../../entities/sistema-causa-inmediata';
import { Util, asyncLocalStorage } from '../../../com/utils/util';
import { File as FilePlugin, FileEntry } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Camera , CameraResultType, Photo} from '@capacitor/camera';
import { ArchivoLocal } from '../../../cop/pages/consulta-actas/consulta-actas.page';
import { MensajeUsuarioService } from '../../../com/services/mensaje-usuario.service';
import { AnalisisDesviacion } from '../../entities/analisis-desviacion';
import { AnalisisDesviacionService } from '../../services/analisis-desviacion.service'
import { DirectorioService } from '../../../ado/services/directorio.service';
import { SistemaCausaAdministrativa } from '../../entities/sistema-causa-administrativa';
import { Tarea } from '../../entities/tarea';
import { Documento } from '../../../ado/entities/documento';
import { StorageService } from '../../../com/services/storage.service';
import { FilterQuery } from '../../../com/entities/filter-query';
import { Criteria } from '../../../com/entities/filter';

@Component({
  selector: 'sm-investigacionDesviaciones',
  templateUrl: './investigacion-desviaciones.component.html',
  styleUrls: ['./investigacion-desviaciones.component.scss'],
  providers: [FileOpener, FilePlugin, AnalisisDesviacionService]
})
export class InvestigacionDesviacionesComponent implements OnInit {
  // options: CameraOptions = {
  //   quality: 75,
  //   destinationType: this.camera.DestinationType.FILE_URI,
  //   encodingType: this.camera.EncodingType.JPEG,
  //   correctOrientation: true,
  //   mediaType: this.camera.MediaType.PICTURE,
  //   targetWidth: 960,
  //   targetHeight: 960,
  // }
  tareasList: Tarea[];
  segments = { 'investigacion': true, 'plan': false };

  @ViewChild('fileChooser') fileChooser: HTMLInputElement;
  documentosList: ArchivoLocal[];
  documentosEliminarList: ArchivoLocal[];
  participantes: Participante[];
  observStr: string;

  @ViewChild('slider') slider: ElementRef;
  // title: string = 'Desviaciones investigadas';

  desviacionesList: Desviacion[];
  sistemaCausaRaiz: SistemaCausaRaiz;
  sistemaCausaInmediata: SistemaCausaInmediata;
  sistemaCausaAdmin: SistemaCausaAdministrativa;

  consultar: boolean;
  modificar: boolean;
  adicionar: boolean;
  analisisId: string;

  analisisNoEncontrado: boolean;
  guardando:boolean;
  loading: boolean = true;
  isTareaList: boolean = true;

  constructor(
    private storageService: StorageService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private dirService: DirectorioService,
    private anDesvService: AnalisisDesviacionService,
    private msgService: MensajeUsuarioService,
    // private camera: Camera,
    private fileOpener: FileOpener,
    private file: FilePlugin,
    private modalController: ModalController,
    private offlineService: OfflineService
  ) {

  }

  ngOnInit() {
    this.modalController.getTop()
      .then(data => {
        this.consultar = (<any>data).componentProps.operacion == 'GET';
        this.modificar = (<any>data).componentProps.operacion == 'PUT';
        this.adicionar = (<any>data).componentProps.operacion == 'POST';

        if (this.consultar == true || this.modificar == true) {
          this.consultarAnalisis((<any>data).componentProps.valor.analisisId);
        } else {
          let completado = {
            completoCI: false,
            completoCR: false,
            completoCA: false,
          }
          this.offlineService.querySistemaCausaInmediata()
            .then(resp => {
              this.sistemaCausaInmediata = resp;
              completado['completoCI'] = true;
              if (this.validarFinCarga(completado)) {
                this.analisisNoEncontrado = false;
                this.loading = false;
              }
            })
            .catch(err => {
              this.analisisNoEncontrado = true;
              this.loading = false;
            });
          this.offlineService.querySistemaCausaRaiz()
            .then(resp => {
              this.sistemaCausaRaiz = resp;
              completado['completoCR'] = true;
              if (this.validarFinCarga(completado)) {
                this.analisisNoEncontrado = false;
                this.loading = false;
              }
            })
            .catch(err => {
              this.analisisNoEncontrado = true;
              this.loading = false;
            });
          this.offlineService.querySistemaCausaAdmin()
            .then(resp => {
              this.sistemaCausaAdmin = resp;
              completado['completoCA'] = true;
              if (this.validarFinCarga(completado)) {
                this.analisisNoEncontrado = false;
                this.loading = false;
              }
            })
            .catch(err => {
              this.analisisNoEncontrado = true;
              this.loading = false;
            });
          this.desviacionesList = (<any>data).componentProps.valor;
        }
      });
  }

  consultarAnalisis(analisisId: string) {
    this.analisisId = analisisId;
    let fq = new FilterQuery();
    fq.filterList = [{ criteria: Criteria.EQUALS, field: 'id', value1: analisisId }];
    this.anDesvService.findByFilter(fq)
      .then(servResp => {
        if (servResp['data'].length > 0) {
          this.storageService.guardarAnalisisDesviacion(<AnalisisDesviacion>servResp['data'][0]);
          this.cargarDatos(<AnalisisDesviacion>servResp['data'][0]);
        } else {
          this.analisisNoEncontrado = true;
        }
      }).catch(err => {
        this.storageService.getAnalisisDesviacion(analisisId)
          .then(resp => {
            if (resp.data.length > 0) {
              this.cargarDatos(<AnalisisDesviacion>resp.data[0]);
            } else {
              this.analisisNoEncontrado = true;
              this.loading = false;
            }
          })
          .catch(err => {
            this.analisisNoEncontrado = true;
            this.loading = false;
          });
      })
  }

  validarFinCarga(completado): boolean {
    let finalizado = true;
    for (const key in completado) {
      finalizado = finalizado && completado[key];
    }
    return finalizado;
  }

  cargarDatos(anlisisParam: AnalisisDesviacion) {
    let completado = {
      completoCI: false,
      completoCR: false,
      completoCA: false,
    }
    let analisis = anlisisParam;
    this.desviacionesList = analisis.desviacionesList;
    this.observStr = analisis.observacion;
    this.offlineService.querySistemaCausaInmediata()
      .then(resp => {
        this.sistemaCausaInmediata = resp;
        Util.cargarSeleccionArbol('causaInmediataList', this.sistemaCausaInmediata.causaInmediataList, analisis.causaInmediataList, 'id');
        completado['completoCI'] = true;
        if (this.validarFinCarga(completado)) {
          this.analisisNoEncontrado = false;
          this.loading = false;
        }
      })
      .catch(err => {
        this.analisisNoEncontrado = true;
        this.loading = false;
      });
    this.offlineService.querySistemaCausaRaiz()
      .then(resp => {
        this.sistemaCausaRaiz = resp;
        Util.cargarSeleccionArbol('causaRaizList', this.sistemaCausaRaiz.causaRaizList, analisis.causaRaizList, 'id');
        completado['completoCR'] = true;
        if (this.validarFinCarga(completado)) {
          this.analisisNoEncontrado = false;
          this.loading = false;
        }
      })
      .catch(err => {
        this.analisisNoEncontrado = true;
        this.loading = false;
      });
    this.offlineService.querySistemaCausaAdmin()
      .then(resp => {
        this.sistemaCausaAdmin = resp;
        Util.cargarSeleccionArbol('causaAdminList', this.sistemaCausaAdmin.causaAdminList, analisis.causasAdminList, 'id');
        completado['completoCA'] = true;
        if (this.validarFinCarga(completado)) {
          this.analisisNoEncontrado = false;
          this.loading = false;
        }
      })
      .catch(err => {
        this.analisisNoEncontrado = true;
        this.loading = false;
      });

    this.participantes = JSON.parse(analisis.participantes);
    this.documentosList = [];
    if (analisis.documentosList != null) {
      for (const doc of analisis.documentosList) {
        let arch: ArchivoLocal = {
          alias: doc.nombre.split('.')[0],
          nombre: doc.nombre,
          fechaCreacion: new Date(),
          ext: Util.getExtension(doc.nombre),
          descripcion: doc.descripcion,
          documentoId: doc.id,
          url: null
        };
        this.documentosList.push(arch);
      }
    }
    this.tareasList = analisis.tareaDesviacionList;
  }

  anterior() {
    this.presentAlertaSalir();
  }

  async presentAlertaSalir() {
    const alert = await this.alertController.create({
      header: '¿Desea salir?',
      message: 'La investigación no ha sido guardada, los datos serán descartados. ¿Confirma esta acción?',
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

  adicionarParticipante() {
    let part: Participante = { cargo: '', nombresApellidos: '', numeroIdentificacion: null, tipoIdentificacion: '' };
    if (this.participantes == null) {
      this.participantes = [];
    }
    this.participantes.unshift(part);
  }
  eliminarParticipante(part, idx) {
    this.participantes.splice(idx, 1);
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

  // getPicture() {
  //   this.camera.getPicture(this.options)
  //     .then(imageData => {
  //       let pathFile = (<string>imageData);
  //       let lastIndex = pathFile.lastIndexOf("/");
  //       let fileName = pathFile.substring(lastIndex + 1, pathFile.length);

  //       let url = (<any>window).Ionic.WebView.convertFileSrc(imageData);
  //       Util.dataURLtoFile(url, fileName).then(
  //         file => this.guardarArchivoLocal(file, fileName)
  //       );
  //     });
  // }
  // getPicture() {
  //   this.camera.getPicture(this.options)
  //     .then(imageData => {
  //       let pathFile = (<string>imageData);
  //       let lastIndex = pathFile.lastIndexOf("/");
  //       let fileName = pathFile.substring(lastIndex + 1, pathFile.length);

  //       let url = (<any>window).Ionic.WebView.convertFileSrc(imageData);
  //       Util.dataURLtoFile(url, fileName).then(
  //         file => this.guardarArchivoLocal(file, fileName)
  //       );
  //     });
  // }
  image: Photo;
imageElement = new Image();
getPicture = async () => {
    this.image = await Camera.getPhoto({
      quality: 75,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var url = this.image.webPath;
    // Can be set to the src of an image now
    // this.imageElement.src = imageUrl;
    // let imgUrl = (<any>window).Ionic.WebView.convertFileSrc(imageData);
    // this.imagenes.push(imageUrl);
    // this.imagenes = this.imagenes.slice();

    let pathFile = (<string>url);
    let lastIndex = pathFile.lastIndexOf("/");
    let fileName = pathFile.substring(lastIndex + 1, url.length);

    // let url = (<any>window).Ionic.WebView.convertFileSrc(imageUrl);
    Util.dataURLtoFile(url, fileName).then(
    file => this.guardarArchivoLocal(file, fileName) 
    );
  };

  guardarArchivoLocal(fileParam: File, fileName: string) {
    let dirPath = this.file.dataDirectory;
    let nombre = (new Date().getTime() + '_' + fileName);
    this.file.writeFile(dirPath, nombre, fileParam, { replace: true })
      .then(fileEntry => {
        let fe = <FileEntry>fileEntry;
        let dir: ArchivoLocal = {
          alias: fileName.split('.')[0],
          nombre: nombre,
          fechaCreacion: new Date(),
          ext: Util.getExtension(fileName),
          url: (<any>window).Ionic.WebView.convertFileSrc(fe.nativeURL)
        };
        if (this.documentosList == null) {
          this.documentosList = [];
        }
        this.documentosList.push(dir);
      });
  }

  visualizar(arch: ArchivoLocal) {
    let filePath = this.file.dataDirectory;
    this.file.checkFile(filePath, arch.nombre)
      .then(exist => {
        return this.file.resolveDirectoryUrl(filePath)
      })
      .then(dirEntry => {
        return this.file.getFile(dirEntry, arch.nombre, null);
      })
      .then(fileEntry => {
        return fileEntry.file(fp => this.openFile(fileEntry, fp.type));
      })
      .catch(err => {
        if (arch.documentoId != null) {
          this.downloadFile(arch);
        } else {
          this.msgService.showMessage({
            tipoMensaje: 'warn', mensaje: 'Archivo no encontrado',
            detalle: "No se ha encontrado el archivo " + arch.alias
          })
        }
      });
  }

  downloadFile(arch: ArchivoLocal) {
    let workingPath = this.file.dataDirectory;
    let loading = this.showLoading('Descargando archivo...');
    this.dirService.descargarArchAnalisis(arch.documentoId)
      .then(resp => {
        var blob = new Blob([<any>resp]);
        return this.file.writeFile(workingPath, arch.nombre, blob, { replace: true });
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

  async showLoading(msg: string) {
    const loading = await this.loadingController.create({
      message: msg,
      translucent: true,
    });
    await loading.present();
    return loading;
  }

  openFile(fileEntry, type: string) {
    this.fileOpener.open(fileEntry.toURL(), type).catch(
      err => this.msgService.showMessage({
        tipoMensaje: 'info', mensaje: 'No ha sido posible visualizar el archivo',
        detalle: "No existe una aplicacion para abrir " + fileEntry.name + "."
      })
    )
  }


  async removerDoc(arch: ArchivoLocal, idx: number) {
    const alert = await this.alertController.create({
      header: '¿Retirar documento?',
      message: 'El documento \"' + arch.alias + '\" será retirado. ¿Confirma esta acción?',
      buttons: [{
        text: 'Si',
        handler: () => {
          this.documentosList.splice(idx, 1);
          if (arch.documentoId != null) {
            if (this.documentosEliminarList == null) {
              this.documentosEliminarList = [];
            }
            this.documentosEliminarList.push(arch);
          }
          this.file.removeFile(this.file.dataDirectory, arch.nombre);
        }
      }, {
        text: 'No',
        role: 'cancel',
        cssClass: 'No'
      }]
    });
    await alert.present();
  }

  /* ******************* PERSISTENCIA ******************** */
  guardarInvestigacion() {
    let causaRaizList = [];
    Util.getSeleccionArbol('causaRaizList', this.sistemaCausaRaiz.causaRaizList, causaRaizList);

    let causaInmediataList = [];
    Util.getSeleccionArbol('causaInmediataList', this.sistemaCausaInmediata.causaInmediataList, causaInmediataList);


    let causaAdminList = [];
    Util.getSeleccionArbol('causaAdminList', this.sistemaCausaAdmin.causaAdminList, causaAdminList);

    let analisis: AnalisisDesviacion = new AnalisisDesviacion();
    analisis.id = this.analisisId;
    analisis.causaInmediataList = causaInmediataList;
    analisis.causaRaizList = causaRaizList;
    analisis.causasAdminList = causaAdminList;
    analisis.desviacionesList = this.desviacionesList;
    analisis.observacion = this.observStr;
    analisis.participantes = JSON.stringify(this.participantes);
    analisis.tareaDesviacionList = this.tareasList;
    this.guardando = true;
    this.persistirInvestigacion(analisis)
      .then(resp => {
        this.guardando = false;
        this.msgService.showMessage({
          tipoMensaje: 'success',
          mensaje: 'Investigación realizada',
          detalle: 'Se ha realizado correctamente la investigación.'
        });
        this.modalController.dismiss({
          analisisDesviacion: resp,
          desviaciones: this.desviacionesList,
          offline: this.offlineService.getOfflineMode()
        });
      })
      .catch(err => {
        this.guardando = false;
      });
  }

  persistirInvestigacion(analisis: AnalisisDesviacion) {
    if (this.offlineService.getOfflineMode()) {
      return new Promise((resolve, reject) => {
        analisis['imagenes'] = this.documentosList;
        analisis['imagenes_eliminar'] = this.documentosEliminarList;

        if (analisis.fechaElaboracion == null)
          analisis.fechaElaboracion = new Date();

        if (analisis['hash'] == null)
          analisis['hash'] = analisis.fechaElaboracion.toISOString();

        this.storageService.guardarAnalisisSync(analisis)
          .then(() => {
            resolve(analisis);
          })
          .catch(err => {
            reject(err);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        if (analisis.id == null) {
          this.anDesvService.create(analisis)
            .then(resp => {
              analisis.id = (<AnalisisDesviacion>resp).id;
              if (this.documentosList != null) {
                this.documentosList.forEach(doc => {
                  Util.dataURLtoFile(doc.url, doc.alias + '.' + doc.ext)
                    .then(file => {
                      let docMetadata = new Documento();
                      docMetadata.descripcion = doc.descripcion;
                      this.dirService.subirArchAnalisis(file, analisis.id, docMetadata);
                    });
                });
              }
              resolve(resp);
            })
            .catch(err => {
              reject(err)
            });
        } else {
          this.anDesvService.update(analisis)
            .then(resp => {
              // Actualiza o crea los documentos del analisis de desviacion realizado
              if (this.documentosList != null) {
                this.documentosList.forEach(arch => {
                  if (arch.documentoId == null) {
                    Util.dataURLtoFile(arch.url, arch.alias + '.' + arch.ext)
                      .then(file => {
                        let docMetadata = new Documento();
                        docMetadata.descripcion = arch.descripcion;
                        this.dirService.subirArchAnalisis(file, analisis.id, docMetadata);
                      });
                  } else {
                    let docUpdate = new Documento();
                    docUpdate.id = arch.documentoId;
                    docUpdate.nombre = arch.alias + '.' + arch.ext;
                    docUpdate.descripcion = arch.descripcion;
                    this.dirService.actualizarArchAnalisis(docUpdate);
                  }
                });
              }
              // Solicita eliminar los documentos marcados para eliminacion permanente.
              if (this.documentosEliminarList != null) {
                this.documentosEliminarList.forEach(arch => {
                  this.dirService.eliminarArchAnalisis(arch.documentoId);
                });
              }
              resolve(resp);
            })
            .catch(err => {
              reject(err);
            });
        }

      });
    }
  }

  /******************************* */
  segmentChanged(event) {
    for (var seg in this.segments) {
      this.segments[seg] = false;
      if (event.detail.value == seg)
        this.segments[seg] = true;

    }
  }

  onEvent(event) {
    this.tareasList = event.data;
    this.isTareaList = false;
  }

  ok(){
    console.log(this.tareasList)
    console.log(this.isTareaList)
    this.isTareaList = !this.isTareaList
    console.log(this.isTareaList)
  }

}

interface Participante {
  nombresApellidos: string;
  cargo: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}