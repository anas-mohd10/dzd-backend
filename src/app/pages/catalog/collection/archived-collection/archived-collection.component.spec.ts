import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedCollectionComponent } from './archived-collection.component';

describe('ArchivedCollectionComponent', () => {
  let component: ArchivedCollectionComponent;
  let fixture: ComponentFixture<ArchivedCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
