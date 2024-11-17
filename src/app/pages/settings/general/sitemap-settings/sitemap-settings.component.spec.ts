import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitemapSettingsComponent } from './sitemap-settings.component';

describe('SitemapSettingsComponent', () => {
  let component: SitemapSettingsComponent;
  let fixture: ComponentFixture<SitemapSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitemapSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemapSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
