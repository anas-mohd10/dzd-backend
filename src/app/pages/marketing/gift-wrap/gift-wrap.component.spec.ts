import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftWrapComponent } from './gift-wrap.component';

describe('GiftWrapComponent', () => {
  let component: GiftWrapComponent;
  let fixture: ComponentFixture<GiftWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftWrapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
