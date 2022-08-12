import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActaFormComponent } from './acta-form.component';

describe('ObservacionFormComponent', () => {
  let component: ActaFormComponent;
  let fixture: ComponentFixture<ActaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
