/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InspeccionesRealizadasComponent } from './inspecciones-realizadas.component';

describe('InspeccionRealizadaComponent', () => {
    let component: InspeccionesRealizadasComponent;
    let fixture: ComponentFixture<InspeccionesRealizadasComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InspeccionesRealizadasComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InspeccionesRealizadasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
