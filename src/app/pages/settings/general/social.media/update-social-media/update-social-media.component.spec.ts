import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSocialMediaComponent } from './update-social-media.component';

describe('UpdateSocialMediaComponent', () => {
  let component: UpdateSocialMediaComponent;
  let fixture: ComponentFixture<UpdateSocialMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSocialMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSocialMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
