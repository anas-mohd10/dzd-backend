import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailerDetailsComponent } from './mailer-details.component';

describe('MailerDetailsComponent', () => {
  let component: MailerDetailsComponent;
  let fixture: ComponentFixture<MailerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
