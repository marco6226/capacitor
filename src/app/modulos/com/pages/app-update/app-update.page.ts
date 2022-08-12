
import { Component, OnInit } from '@angular/core';
import { Market } from '@ionic-native/market/ngx';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'sm-appUpdae',
    templateUrl: './app-update.page.html',
    styleUrls: ['./app-update.page.scss'],
    providers: [Market]
})
export class AppUpdatePage implements OnInit {

    constructor(
        public authService: AuthService,
        public modalCtrl: ModalController,
        public market: Market,
    ) {

    }

    ngOnInit() {
        this.authService.logout();
        this.modalCtrl.dismiss();
    }

    redireccionar() {
        let so = localStorage.getItem('plataforma');
        if (so == 'android'){
            this.market.open('co.sigess.app');
        } else if (so == 'ios'){
            this.market.open('1562431304');
        } else {
            alert("Plataforma no detectada");
        }
    }
}