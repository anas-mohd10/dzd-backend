import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMailersComponent } from './custom-mailers.component';

describe('CustomMailersComponent', () => {
  let component: CustomMailersComponent;
  let fixture: ComponentFixture<CustomMailersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMailersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMailersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
