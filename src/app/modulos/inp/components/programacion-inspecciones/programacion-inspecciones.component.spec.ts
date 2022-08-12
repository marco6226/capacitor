import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionInspeccionesComponent } from './programacion-inspecciones.component';

describe('ProgramacionInspeccionesComponent', () => {
  let component: ProgramacionInspeccionesComponent;
  let fixture: ComponentFixture<ProgramacionInspeccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramacionInspeccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramacionInspeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
