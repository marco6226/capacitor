import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisDesviacionesSyncComponent } from './analisis-desviaciones-sync.component';

describe('ObservacionFormComponent', () => {
  let component: AnalisisDesviacionesSyncComponent;
  let fixture: ComponentFixture<AnalisisDesviacionesSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisDesviacionesSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisDesviacionesSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
