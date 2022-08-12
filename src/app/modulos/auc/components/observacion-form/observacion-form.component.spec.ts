import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionFormComponent } from './observacion-form.component';

describe('ObservacionFormComponent', () => {
  let component: ObservacionFormComponent;
  let fixture: ComponentFixture<ObservacionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
