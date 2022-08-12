import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionFormComponent } from './inspeccion-form.component';

describe('InspeccionFormComponent', () => {
  let component: InspeccionFormComponent;
  let fixture: ComponentFixture<InspeccionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspeccionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
