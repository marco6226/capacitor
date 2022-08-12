import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTareasPage } from './mis-tareas.page';

describe('ElaboracionInspeccionPage', () => {
  let component: MisTareasPage;
  let fixture: ComponentFixture<MisTareasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisTareasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisTareasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
