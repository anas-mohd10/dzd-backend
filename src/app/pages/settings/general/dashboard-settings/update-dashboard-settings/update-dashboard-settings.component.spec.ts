import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDashboardSettingsComponent } from './update-dashboard-settings.component';

describe('UpdateDashboardSettingsComponent', () => {
  let component: UpdateDashboardSettingsComponent;
  let fixture: ComponentFixture<UpdateDashboardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDashboardSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDashboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
