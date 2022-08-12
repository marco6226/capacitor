
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'sm-secInicio',
    templateUrl: './sec-inicio.page.html',
    styleUrls: ['./sec-inicio.page.scss'],
    providers: []
})
export class SecInicioPage implements OnInit {

    constructor(
        private router: Router,
    ) { }

    ngOnInit() {

    }

    navegar(url) {
        this.router.navigate([url]);
    }
}