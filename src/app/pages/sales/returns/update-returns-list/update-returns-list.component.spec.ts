import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReturnsListComponent } from './update-returns-list.component';

describe('UpdateReturnsListComponent', () => {
  let component: UpdateReturnsListComponent;
  let fixture: ComponentFixture<UpdateReturnsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateReturnsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateReturnsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
