import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppSettingsComponent } from './add-app-settings.component';

describe('AddAppSettingsComponent', () => {
  let component: AddAppSettingsComponent;
  let fixture: ComponentFixture<AddAppSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAppSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAppSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
