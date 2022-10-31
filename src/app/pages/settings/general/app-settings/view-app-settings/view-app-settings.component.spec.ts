import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppSettingsComponent } from './view-app-settings.component';

describe('ViewAppSettingsComponent', () => {
  let component: ViewAppSettingsComponent;
  let fixture: ComponentFixture<ViewAppSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAppSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
