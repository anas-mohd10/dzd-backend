import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocialNediaComponent } from './add-social-nedia.component';

describe('AddSocialNediaComponent', () => {
  let component: AddSocialNediaComponent;
  let fixture: ComponentFixture<AddSocialNediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSocialNediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSocialNediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
