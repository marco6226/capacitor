/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InspeccionConsultarFormComponent } from './inspeccion-consultar-form.component';

describe('InspeccionConsultarFormComponent', () => {
  let component: InspeccionConsultarFormComponent;
  let fixture: ComponentFixture<InspeccionConsultarFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspeccionConsultarFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionConsultarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
