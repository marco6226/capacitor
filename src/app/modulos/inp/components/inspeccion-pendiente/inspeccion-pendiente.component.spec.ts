import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InspeccionPendienteComponent } from './inspeccion-pendiente.component';


describe('ProgramacionInspeccionesComponent', () => {
  let component: InspeccionPendienteComponent;
  let fixture: ComponentFixture<InspeccionPendienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspeccionPendienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionPendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
