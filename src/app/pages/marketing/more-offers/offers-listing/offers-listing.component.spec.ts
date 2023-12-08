import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersListingComponent } from './offers-listing.component';

describe('OffersListingComponent', () => {
  let component: OffersListingComponent;
  let fixture: ComponentFixture<OffersListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
