import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeUsuarioComponent } from './mensaje-usuario.component';

describe('MensajeUsuarioComponent', () => {
  let component: MensajeUsuarioComponent;
  let fixture: ComponentFixture<MensajeUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
