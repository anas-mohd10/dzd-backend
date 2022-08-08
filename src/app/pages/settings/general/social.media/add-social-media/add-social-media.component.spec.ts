import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocialMediaComponent } from './add-social-media.component';

describe('AddSocialMediaComponent', () => {
  let component: AddSocialMediaComponent;
  let fixture: ComponentFixture<AddSocialMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSocialMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSocialMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
