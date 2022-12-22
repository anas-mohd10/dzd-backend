import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHeadComponent } from './update-head.component';

describe('UpdateHeadComponent', () => {
  let component: UpdateHeadComponent;
  let fixture: ComponentFixture<UpdateHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
