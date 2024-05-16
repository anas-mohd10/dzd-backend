import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePagesComponent } from './update-pages.component';

describe('UpdatePagesComponent', () => {
  let component: UpdatePagesComponent;
  let fixture: ComponentFixture<UpdatePagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
