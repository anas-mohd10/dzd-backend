import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPackingSlipsComponent } from './bulk-packing-slips.component';

describe('BulkPackingSlipsComponent', () => {
  let component: BulkPackingSlipsComponent;
  let fixture: ComponentFixture<BulkPackingSlipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkPackingSlipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkPackingSlipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
