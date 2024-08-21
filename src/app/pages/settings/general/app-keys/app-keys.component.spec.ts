import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppKeysComponent } from './app-keys.component';

describe('AppKeysComponent', () => {
  let component: AppKeysComponent;
  let fixture: ComponentFixture<AppKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppKeysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
