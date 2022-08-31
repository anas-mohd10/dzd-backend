import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBannerListComponent } from './update-banner-list.component';

describe('UpdateBannerListComponent', () => {
  let component: UpdateBannerListComponent;
  let fixture: ComponentFixture<UpdateBannerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBannerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBannerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
