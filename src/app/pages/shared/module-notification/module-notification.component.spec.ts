import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleNotificationComponent } from './module-notification.component';

describe('ModuleNotificationComponent', () => {
  let component: ModuleNotificationComponent;
  let fixture: ComponentFixture<ModuleNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
