import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfo3Component } from './basic-info3.component';

describe('BasicInfo3Component', () => {
  let component: BasicInfo3Component;
  let fixture: ComponentFixture<BasicInfo3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfo3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfo3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
