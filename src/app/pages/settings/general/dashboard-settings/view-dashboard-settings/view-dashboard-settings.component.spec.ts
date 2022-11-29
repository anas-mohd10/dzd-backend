import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDashboardSettingsComponent } from './view-dashboard-settings.component';

describe('ViewDashboardSettingsComponent', () => {
  let component: ViewDashboardSettingsComponent;
  let fixture: ComponentFixture<ViewDashboardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDashboardSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDashboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
