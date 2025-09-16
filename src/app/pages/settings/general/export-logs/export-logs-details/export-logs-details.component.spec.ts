import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogsDetailsComponent } from './export-logs-details.component';

describe('ExportLogsDetailsComponent', () => {
    let component: ExportLogsDetailsComponent;
    let fixture: ComponentFixture<ExportLogsDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExportLogsDetailsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ExportLogsDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
}); 