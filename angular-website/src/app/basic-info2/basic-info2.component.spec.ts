import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfo2Component } from './basic-info2.component';

describe('BasicInfo2Component', () => {
  let component: BasicInfo2Component;
  let fixture: ComponentFixture<BasicInfo2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfo2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
