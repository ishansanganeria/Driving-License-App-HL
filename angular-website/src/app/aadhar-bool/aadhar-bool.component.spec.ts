import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharBoolComponent } from './aadhar-bool.component';

describe('AadharBoolComponent', () => {
  let component: AadharBoolComponent;
  let fixture: ComponentFixture<AadharBoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AadharBoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AadharBoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
