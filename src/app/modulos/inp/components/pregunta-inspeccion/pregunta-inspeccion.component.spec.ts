import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaInspeccionComponent } from './pregunta-inspeccion.component';

describe('PreguntaInspeccionComponent', () => {
  let component: PreguntaInspeccionComponent;
  let fixture: ComponentFixture<PreguntaInspeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreguntaInspeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntaInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
