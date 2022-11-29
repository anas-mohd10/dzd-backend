import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDashboardSettingsComponent } from './add-dashboard-settings.component';

describe('AddDashboardSettingsComponent', () => {
  let component: AddDashboardSettingsComponent;
  let fixture: ComponentFixture<AddDashboardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDashboardSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDashboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
