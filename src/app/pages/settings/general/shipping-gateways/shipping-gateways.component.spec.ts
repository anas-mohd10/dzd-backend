import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingGatewaysComponent } from './shipping-gateways.component';

describe('ShippingGatewaysComponent', () => {
  let component: ShippingGatewaysComponent;
  let fixture: ComponentFixture<ShippingGatewaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingGatewaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingGatewaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
