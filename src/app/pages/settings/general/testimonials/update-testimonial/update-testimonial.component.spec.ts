import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTestimonialComponent } from './update-testimonial.component';

describe('UpdateTestimonialComponent', () => {
  let component: UpdateTestimonialComponent;
  let fixture: ComponentFixture<UpdateTestimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTestimonialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
