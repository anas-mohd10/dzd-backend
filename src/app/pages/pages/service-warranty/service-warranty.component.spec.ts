import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceWarrantyComponent } from './service-warranty.component';

describe('ServiceWarrantyComponent', () => {
  let component: ServiceWarrantyComponent;
  let fixture: ComponentFixture<ServiceWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceWarrantyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
