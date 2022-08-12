import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElaboracionInspeccionPage } from './elaboracion-inspeccion.page';

describe('ElaboracionInspeccionPage', () => {
  let component: ElaboracionInspeccionPage;
  let fixture: ComponentFixture<ElaboracionInspeccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElaboracionInspeccionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElaboracionInspeccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
