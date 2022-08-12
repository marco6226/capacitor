import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionesSyncComponent } from './inspecciones-sync.component';

describe('ProgramacionInspeccionesComponent', () => {
  let component: InspeccionesSyncComponent;
  let fixture: ComponentFixture<InspeccionesSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspeccionesSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionesSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
