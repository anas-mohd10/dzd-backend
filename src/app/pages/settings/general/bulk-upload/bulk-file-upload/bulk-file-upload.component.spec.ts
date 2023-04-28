import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkFileUploadComponent } from './bulk-file-upload.component';

describe('BulkFileUploadComponent', () => {
  let component: BulkFileUploadComponent;
  let fixture: ComponentFixture<BulkFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
