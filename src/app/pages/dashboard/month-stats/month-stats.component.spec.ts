import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthStatsComponent } from './month-stats.component';

describe('MonthStatsComponent', () => {
  let component: MonthStatsComponent;
  let fixture: ComponentFixture<MonthStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
