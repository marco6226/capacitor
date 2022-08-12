import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InspeccionesRealizadasNoProgamadasComponent } from './inspecciones-realizadas-no-progamadas.component';

describe('InspeccionesRealizadasNoProgamadasComponent', () => {
  let component: InspeccionesRealizadasNoProgamadasComponent;
  let fixture: ComponentFixture<InspeccionesRealizadasNoProgamadasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InspeccionesRealizadasNoProgamadasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InspeccionesRealizadasNoProgamadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
