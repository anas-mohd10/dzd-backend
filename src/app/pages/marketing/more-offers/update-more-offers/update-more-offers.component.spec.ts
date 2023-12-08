import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMoreOffersComponent } from './update-more-offers.component';

describe('UpdateMoreOffersComponent', () => {
  let component: UpdateMoreOffersComponent;
  let fixture: ComponentFixture<UpdateMoreOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMoreOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMoreOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
