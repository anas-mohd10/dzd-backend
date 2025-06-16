import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageHotspotsComponent } from './image-hotspots.component';

describe('ImageHotspotsComponent', () => {
  let component: ImageHotspotsComponent;
  let fixture: ComponentFixture<ImageHotspotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageHotspotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageHotspotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
