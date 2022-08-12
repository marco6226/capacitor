import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGraficaComponent } from './panel-grafica.component';

describe('MensajeUsuarioComponent', () => {
  let component: PanelGraficaComponent;
  let fixture: ComponentFixture<PanelGraficaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelGraficaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelGraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
