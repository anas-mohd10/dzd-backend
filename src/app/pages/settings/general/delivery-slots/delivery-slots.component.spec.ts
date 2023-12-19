import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverySlotsComponent } from './delivery-slots.component';

describe('DeliverySlotsComponent', () => {
  let component: DeliverySlotsComponent;
  let fixture: ComponentFixture<DeliverySlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverySlotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverySlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
