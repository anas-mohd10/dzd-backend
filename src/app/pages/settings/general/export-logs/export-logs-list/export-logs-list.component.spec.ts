import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogsListComponent } from './export-logs-list.component';

describe('ExportLogsListComponent', () => {
  let component: ExportLogsListComponent;
  let fixture: ComponentFixture<ExportLogsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportLogsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 