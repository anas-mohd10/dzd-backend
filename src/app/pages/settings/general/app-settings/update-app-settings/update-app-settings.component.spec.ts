import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppSettingsComponent } from './update-app-settings.component';

describe('UpdateAppSettingsComponent', () => {
  let component: UpdateAppSettingsComponent;
  let fixture: ComponentFixture<UpdateAppSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAppSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAppSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
