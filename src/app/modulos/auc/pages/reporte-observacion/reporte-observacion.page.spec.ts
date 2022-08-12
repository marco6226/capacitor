import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteObservacionPage } from './reporte-observacion.page';

describe('ReporteObservacionPage', () => {
  let component: ReporteObservacionPage;
  let fixture: ComponentFixture<ReporteObservacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteObservacionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteObservacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
