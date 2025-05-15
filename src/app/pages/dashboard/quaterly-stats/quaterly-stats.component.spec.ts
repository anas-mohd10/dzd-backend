import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaterlyStatsComponent } from './quaterly-stats.component';

describe('QuaterlyStatsComponent', () => {
  let component: QuaterlyStatsComponent;
  let fixture: ComponentFixture<QuaterlyStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuaterlyStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuaterlyStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
