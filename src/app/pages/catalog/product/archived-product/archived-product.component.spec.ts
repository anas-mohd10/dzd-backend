import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedProductComponent } from './archived-product.component';

describe('ArchivedProductComponent', () => {
  let component: ArchivedProductComponent;
  let fixture: ComponentFixture<ArchivedProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
