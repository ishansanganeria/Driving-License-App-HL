import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfo1Component } from './basic-info1.component';

describe('BasicInfo1Component', () => {
  let component: BasicInfo1Component;
  let fixture: ComponentFixture<BasicInfo1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfo1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
