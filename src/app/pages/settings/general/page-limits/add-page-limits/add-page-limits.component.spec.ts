import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPageLimitsComponent } from './add-page-limits.component';

describe('AddPageLimitsComponent', () => {
  let component: AddPageLimitsComponent;
  let fixture: ComponentFixture<AddPageLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPageLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPageLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
