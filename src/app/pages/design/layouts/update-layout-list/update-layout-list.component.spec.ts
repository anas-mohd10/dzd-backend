import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLayoutListComponent } from './update-layout-list.component';

describe('UpdateLayoutListComponent', () => {
  let component: UpdateLayoutListComponent;
  let fixture: ComponentFixture<UpdateLayoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLayoutListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLayoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
