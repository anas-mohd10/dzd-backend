import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNotificationsComponent } from './update-notifications.component';

describe('UpdateNotificationsComponent', () => {
  let component: UpdateNotificationsComponent;
  let fixture: ComponentFixture<UpdateNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
