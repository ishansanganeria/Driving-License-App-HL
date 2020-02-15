import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskUserOfficerComponent } from './ask-user-officer.component';

describe('AskUserOfficerComponent', () => {
  let component: AskUserOfficerComponent;
  let fixture: ComponentFixture<AskUserOfficerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskUserOfficerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskUserOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
