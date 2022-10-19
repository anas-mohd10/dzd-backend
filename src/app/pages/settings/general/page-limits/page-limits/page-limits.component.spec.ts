import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLimitsComponent } from './page-limits.component';

describe('PageLimitsComponent', () => {
  let component: PageLimitsComponent;
  let fixture: ComponentFixture<PageLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
