// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouteReuseStrategy } from '@angular/router';

// import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';

// @NgModule({
//   declarations: [AppComponent],
//   imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
//   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}
import { NumeroEconomicoService } from './modulos/inp/services/numero-economico.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SplashScreen } from '@capacitor/splash-screen';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StatusBar, Style } from '@capacitor/status-bar';
// import { Camera } from '@ionic-native/camera/ngx';
import { Camera } from '@capacitor/camera';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MensajeUsuarioService } from './modulos/com/services/mensaje-usuario.service';
import { SesionService } from './modulos/com/services/sesion.service';
import { HttpClientModule } from '@angular/common/http';

import { ComunModule } from './modulos/com/comun.module';
import { AuthService } from './modulos/com/services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAuthInterceptor } from './modulos/com/services/http-auth-interceptor';
import { CambioPasswdService } from './modulos/com/services/cambio-passwd.service';
import { OfflineService } from './modulos/com/services/offline.service';
import { StorageService } from './modulos/com/services/storage.service';
import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { TienePermisoDirective } from './modulos/com/directives/tiene-permiso.directive';
// import { FileTransfer } from '@ionic-native/file-transfer/ngx';
// import { AppVersion } from '@ionic-native/app-version/ngx';
import { App } from '@capacitor/app';
import { EmpleadoService } from './modulos/com/services/empleado.service';
// import { AutoCompleteModule } from 'primeng/autocomplete';
import { MisTareasPageModule } from './modulos/sec/pages/mis-tareas/mis-tareas.module';
import { AutoCompleteModule } from 'ionic4-auto-complete';


// class SQLiteMock {
//   public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
//     return new Promise((resolve, reject) => {
//       resolve(new SQLiteObject(new Object()));
//     });
//   }

//   public executeSql(sql: string): Promise<SQLiteObject> {
//     return new Promise((resolve, reject) => {
//       resolve(new SQLiteObject(new Object()));
//     });
//   }
// }

@NgModule({
    declarations: [
        AppComponent,
        // MisTareasPage,
        // TareaPage,
        // TareaGeneralComponent,
        // TareaSeguimientoComponent,
        // TareaCierreComponent,
    ],
    entryComponents: [
        // TareaPage,
        //TareaCierreComponent
    ],
    imports: [
        BrowserModule, 
        BrowserAnimationsModule, 
        IonicModule.forRoot({ hardwareBackButton: false }), 
        AppRoutingModule, 
        ComunModule, 
        HttpClientModule, 
        AutoCompleteModule,
        // TareaModule,
        MisTareasPageModule
        // FiltroModule
    ],
    providers: [
        // FileTransfer,
        MensajeUsuarioService,
        CambioPasswdService,
        EmpleadoService,
        SesionService,
        // StatusBar,
        // SplashScreen,
        Camera,
        AuthService,
        OfflineService,
        SQLite,
        StorageService,
        // AppVersion,
        NumeroEconomicoService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        // { provide: SQLite, useClass: SQLiteMock },
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
