import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCoversComponent } from './page-covers.component';

describe('PageCoversComponent', () => {
  let component: PageCoversComponent;
  let fixture: ComponentFixture<PageCoversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCoversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCoversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
