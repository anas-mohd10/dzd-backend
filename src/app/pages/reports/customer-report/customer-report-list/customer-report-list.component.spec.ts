import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReportListComponent } from './customer-report-list.component';

describe('CustomerReportListComponent', () => {
  let component: CustomerReportListComponent;
  let fixture: ComponentFixture<CustomerReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
