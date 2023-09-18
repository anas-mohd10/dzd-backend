import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedOrderComponent } from './detailed-order.component';

describe('DetailedOrderComponent', () => {
  let component: DetailedOrderComponent;
  let fixture: ComponentFixture<DetailedOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
