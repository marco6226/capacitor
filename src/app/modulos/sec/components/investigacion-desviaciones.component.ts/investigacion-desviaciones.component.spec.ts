import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigacionDesviacionesComponent } from './investigacion-desviaciones.component';

describe('ObservacionFormComponent', () => {
  let component: InvestigacionDesviacionesComponent;
  let fixture: ComponentFixture<InvestigacionDesviacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigacionDesviacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigacionDesviacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
