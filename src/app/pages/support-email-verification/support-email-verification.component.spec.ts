import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportEmailVerificationComponent } from './support-email-verification.component';

describe('SupportEmailVerificationComponent', () => {
  let component: SupportEmailVerificationComponent;
  let fixture: ComponentFixture<SupportEmailVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportEmailVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
