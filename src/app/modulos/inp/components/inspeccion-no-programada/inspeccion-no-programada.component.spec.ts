import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionNoProgramadaComponent } from './inspeccion-no-programada.component';

describe('ProgramacionInspeccionesComponent', () => {
  let component: InspeccionNoProgramadaComponent;
  let fixture: ComponentFixture<InspeccionNoProgramadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspeccionNoProgramadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionNoProgramadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
