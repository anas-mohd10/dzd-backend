import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkMediaUploadComponent } from './bulk-media-upload.component';

describe('BulkMediaUploadComponent', () => {
  let component: BulkMediaUploadComponent;
  let fixture: ComponentFixture<BulkMediaUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkMediaUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkMediaUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
