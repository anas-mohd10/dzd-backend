import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePageLimitsComponent } from './update-page-limits.component';

describe('UpdatePageLimitsComponent', () => {
  let component: UpdatePageLimitsComponent;
  let fixture: ComponentFixture<UpdatePageLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePageLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePageLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
