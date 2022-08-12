import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUpdatePage } from './app-update.page';

describe('ElaboracionInspeccionPage', () => {
  let component: AppUpdatePage;
  let fixture: ComponentFixture<AppUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUpdatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
