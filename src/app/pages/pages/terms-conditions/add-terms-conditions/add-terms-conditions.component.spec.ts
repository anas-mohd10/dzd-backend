import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTermsConditionsComponent } from './add-terms-conditions.component';

describe('AddTermsConditionsComponent', () => {
  let component: AddTermsConditionsComponent;
  let fixture: ComponentFixture<AddTermsConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTermsConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
