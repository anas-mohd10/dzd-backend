import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CsvService } from 'src/app/includes/services/csv.service';

interface ExportDetails {
    // IDENTIFIERS
    _id: string;
    title: string;

    // STATUS & PROGRESS
    status: "awaiting" | "processing" | "completed" | "completed_with_errors" | "failed";
    percentComplete: number;
    processedRecords: number;
    totalRecords: number;

    // FILE & DOWNLOAD
    exportType: "csv" | "json";
    file?: string;

    // TIMING
    startTime: string;
    endTime?: string;
    executionTime: number;
    executionTimeFormatted: string;

    // ERRORS
    error?: string;
    errorCount: number;
    errorLog: string[];
    hasErrors: boolean;

    // EMAIL
    emailSent: boolean;
    emailError?: string;

    // METADATA
    type: "products";
    exportCondition: "all" | "selected" | "basic";
    createdBy: string;
    createdAt: string;
}

@Component({
    selector: 'app-export-logs-details',
    templateUrl: './export-logs-details.component.html',
    styleUrls: ['./export-logs-details.component.scss'],
})
export class ExportLogsDetailsComponent implements OnInit {
    exportId: string;
    appRoute = appRoutes;
    exportDetails: ExportDetails;

    constructor(
        private ActivatedRoute: ActivatedRoute,
        private CsvService: CsvService,
        private ChangeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.exportId = this.ActivatedRoute.snapshot.params.exportId || '';

        this.CsvService.getFileExportDetails(this.exportId).subscribe({
            next: (res: any) => {
                if (res?.success && res?.errorCode === 0) {
                    this.exportDetails = res.result;
                    this.ChangeDetectorRef.markForCheck();
                }
            }, error: (err: any) => {
                console.error('Failed to fetch export details:', err);
            },
        });
    }

    formatDate(date: string) {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    formatTime(time: string) {
        return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
    }

    downloadExportFile() {
        if (this.exportDetails?.file) {
            window.open(this.exportDetails.file, '_blank');
        }
    }



    formatStatus(status: string) {
        return `${status[0].toUpperCase()}${status.slice(1)}`;
    }
} 