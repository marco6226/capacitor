// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],
// })
// export class AppComponent {
//   constructor() {}
// }
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SplashScreen } from '@capacitor/splash-screen';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StatusBar, Style } from '@capacitor/status-bar';
// import { AppVersion } from '@ionic-native/app-version/ngx';
import { App } from '@capacitor/app';
import { StorageService } from './modulos/com/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    }
  ];

  constructor(
    private storage : StorageService,
    // private appVersion: AppVersion,
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready()
    .then(async () => {
      this.storage.init();
      let so = this.platform.is('ios') == true ? 'ios' : 'android';
      localStorage.setItem('plataforma', so);
      
      let version=(await App.getInfo()).version
      localStorage.setItem("app_version", version);
      console.log(version);
      // this.appVersion.getVersionNumber()
      //   .then(value => {
      //     localStorage.setItem("app_version", value);
      //     console.log(value);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });

      document.addEventListener("backbutton", function (e) {
        console.log("disable back button")
      }, false);

      // this.statusBar.styleDefault();
      await StatusBar.setStyle({ style: Style.Light });
      await SplashScreen.hide();
    });
  }


}
