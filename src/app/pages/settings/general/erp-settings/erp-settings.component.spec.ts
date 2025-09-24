import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpSettingsComponent } from './erp-settings.component';

describe('ErpSettingsComponent', () => {
  let component: ErpSettingsComponent;
  let fixture: ComponentFixture<ErpSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErpSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErpSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});