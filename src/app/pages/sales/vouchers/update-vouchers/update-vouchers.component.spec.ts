import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVouchersComponent } from './update-vouchers.component';

describe('UpdateVouchersComponent', () => {
  let component: UpdateVouchersComponent;
  let fixture: ComponentFixture<UpdateVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
