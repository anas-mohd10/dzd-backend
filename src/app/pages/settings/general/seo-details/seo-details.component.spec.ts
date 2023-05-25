import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoDetailsComponent } from './seo-details.component';

describe('SeoDetailsComponent', () => {
  let component: SeoDetailsComponent;
  let fixture: ComponentFixture<SeoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeoDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
