import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReportListComponent } from './product-report-list.component';

describe('ProductReportListComponent', () => {
  let component: ProductReportListComponent;
  let fixture: ComponentFixture<ProductReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
