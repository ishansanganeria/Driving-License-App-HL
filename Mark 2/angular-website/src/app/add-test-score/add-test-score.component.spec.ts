import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestScoreComponent } from './add-test-score.component';

describe('AddTestScoreComponent', () => {
  let component: AddTestScoreComponent;
  let fixture: ComponentFixture<AddTestScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTestScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTestScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
