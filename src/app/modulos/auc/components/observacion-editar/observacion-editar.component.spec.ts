import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionEditarComponent } from './observacion-editar.component';

describe('ObservacionEditarComponent', () => {
  let component: ObservacionEditarComponent;
  let fixture: ComponentFixture<ObservacionEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservacionEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
