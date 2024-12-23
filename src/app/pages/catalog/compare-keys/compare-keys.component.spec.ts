import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareKeysComponent } from './compare-keys.component';

describe('CompareKeysComponent', () => {
  let component: CompareKeysComponent;
  let fixture: ComponentFixture<CompareKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareKeysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
