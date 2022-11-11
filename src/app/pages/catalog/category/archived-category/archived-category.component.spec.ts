import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedCategoryComponent } from './archived-category.component';

describe('ArchivedCategoryComponent', () => {
  let component: ArchivedCategoryComponent;
  let fixture: ComponentFixture<ArchivedCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
