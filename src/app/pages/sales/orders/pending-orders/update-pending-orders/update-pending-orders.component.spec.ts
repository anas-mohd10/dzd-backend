import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePendingOrdersComponent } from './update-pending-orders.component';

describe('UpdatePendingOrdersComponent', () => {
  let component: UpdatePendingOrdersComponent;
  let fixture: ComponentFixture<UpdatePendingOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePendingOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePendingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
