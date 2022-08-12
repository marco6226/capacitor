import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionSyncComponent } from './observacion-sync.component';

describe('ObservacionFormComponent', () => {
  let component: ObservacionSyncComponent;
  let fixture: ComponentFixture<ObservacionSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
