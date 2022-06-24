import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaxRulesComponent } from './update-tax-rules.component';

describe('UpdateTaxRulesComponent', () => {
  let component: UpdateTaxRulesComponent;
  let fixture: ComponentFixture<UpdateTaxRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTaxRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaxRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
