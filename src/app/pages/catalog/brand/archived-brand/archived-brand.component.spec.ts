import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedBrandComponent } from './archived-brand.component';

describe('ArchivedBrandComponent', () => {
  let component: ArchivedBrandComponent;
  let fixture: ComponentFixture<ArchivedBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedBrandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
