import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePickupComponent } from './update-pickup.component';

describe('UpdatePickupComponent', () => {
  let component: UpdatePickupComponent;
  let fixture: ComponentFixture<UpdatePickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePickupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
