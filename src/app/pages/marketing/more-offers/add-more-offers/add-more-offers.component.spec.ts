import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreOffersComponent } from './add-more-offers.component';

describe('AddMoreOffersComponent', () => {
  let component: AddMoreOffersComponent;
  let fixture: ComponentFixture<AddMoreOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoreOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
