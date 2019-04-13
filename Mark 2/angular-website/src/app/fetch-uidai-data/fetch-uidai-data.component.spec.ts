import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchUidaiDataComponent } from './fetch-uidai-data.component';

describe('FetchUidaiDataComponent', () => {
  let component: FetchUidaiDataComponent;
  let fixture: ComponentFixture<FetchUidaiDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchUidaiDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchUidaiDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
