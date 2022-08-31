import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLayoutListComponent } from './add-layout-list.component';

describe('AddLayoutListComponent', () => {
  let component: AddLayoutListComponent;
  let fixture: ComponentFixture<AddLayoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLayoutListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLayoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
