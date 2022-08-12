import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ObservacionTarjetasComponent } from './observacion-tarjetas.component';

describe('ObservacionTarjetasComponent', () => {
  let component: ObservacionTarjetasComponent;
  let fixture: ComponentFixture<ObservacionTarjetasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionTarjetasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ObservacionTarjetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
