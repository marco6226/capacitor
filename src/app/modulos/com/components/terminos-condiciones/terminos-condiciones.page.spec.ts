import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosCondicionesComponent } from './terminos-condiciones.component';

describe('TerminosCondicionesComponent', () => {
  let component: TerminosCondicionesComponent;
  let fixture: ComponentFixture<TerminosCondicionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminosCondicionesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminosCondicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
