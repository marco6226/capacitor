import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ObservacionConsultarFormComponent } from './observacion-consultar-form.component';

describe('ObservacionConsultarFormComponent', () => {
  let component: ObservacionConsultarFormComponent;
  let fixture: ComponentFixture<ObservacionConsultarFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionConsultarFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ObservacionConsultarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
