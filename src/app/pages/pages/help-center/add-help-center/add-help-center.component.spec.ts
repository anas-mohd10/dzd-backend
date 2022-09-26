import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHelpCenterComponent } from './add-help-center.component';

describe('AddHelpCenterComponent', () => {
  let component: AddHelpCenterComponent;
  let fixture: ComponentFixture<AddHelpCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHelpCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHelpCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
