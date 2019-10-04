import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLicenseComponent } from './apply-license.component';

describe('ApplyLicenseComponent', () => {
  let component: ApplyLicenseComponent;
  let fixture: ComponentFixture<ApplyLicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
