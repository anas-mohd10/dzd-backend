import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBannerListComponent } from './add-banner-list.component';

describe('AddBannerListComponent', () => {
  let component: AddBannerListComponent;
  let fixture: ComponentFixture<AddBannerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBannerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBannerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
