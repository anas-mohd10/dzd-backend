import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSocialNediaComponent } from './update-social-nedia.component';

describe('UpdateSocialNediaComponent', () => {
  let component: UpdateSocialNediaComponent;
  let fixture: ComponentFixture<UpdateSocialNediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSocialNediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSocialNediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
