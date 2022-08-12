import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciasElementoInspeccionComponent } from './evidencias-elemento-inspeccion.component';

describe('EvidenciasElementoInspeccionComponent', () => {
  let component: EvidenciasElementoInspeccionComponent;
  let fixture: ComponentFixture<EvidenciasElementoInspeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvidenciasElementoInspeccionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenciasElementoInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
