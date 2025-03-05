import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownResultsComponent } from './dropdown-results.component';

describe('DropdownResultsComponent', () => {
  let component: DropdownResultsComponent;
  let fixture: ComponentFixture<DropdownResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
