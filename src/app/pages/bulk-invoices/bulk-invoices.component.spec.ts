import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkInvoicesComponent } from './bulk-invoices.component';

describe('BulkInvoicesComponent', () => {
  let component: BulkInvoicesComponent;
  let fixture: ComponentFixture<BulkInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
