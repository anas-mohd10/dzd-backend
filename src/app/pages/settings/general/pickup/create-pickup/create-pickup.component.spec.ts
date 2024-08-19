import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePickupComponent } from './create-pickup.component';

describe('CreatePickupComponent', () => {
  let component: CreatePickupComponent;
  let fixture: ComponentFixture<CreatePickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePickupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
