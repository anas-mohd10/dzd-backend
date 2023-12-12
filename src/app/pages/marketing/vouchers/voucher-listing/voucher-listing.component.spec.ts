import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherListingComponent } from './voucher-listing.component';

describe('VoucherListingComponent', () => {
  let component: VoucherListingComponent;
  let fixture: ComponentFixture<VoucherListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
