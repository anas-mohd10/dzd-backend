import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CsvService } from 'src/app/includes/services/csv.service';

interface ExportDetails {
    _id: string;
    title: string;
    status: "awaiting" | "processing" | "completed" | "completed_with_errors" | "failed";
    percentComplete: number;
    processedRecords: number;
    totalRecords: number;
    exportType: "csv" | "json";
    file?: string;
    startTime: string;
    endTime?: string;
    executionTime: number;
    executionTimeFormatted: string;
    error?: string;
    errorCount: number;
    errorLog: string[];
    hasErrors: boolean;
    emailSent: boolean;
    emailError?: string;
    type: "products";
    exportCondition: "all" | "selected" | "basic";
    createdBy: { name: string, email: string };
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

    downloadExportFile() {
        if (this.exportDetails?.file) {
            window.open(this.exportDetails.file, '_blank');
        }
    }

    convertMillisecondsToMinutes(milliseconds: number) {
        const ms = Number(milliseconds);

        if (
            typeof milliseconds === 'boolean' ||        // true/false not allowed
            Number.isNaN(ms) ||                         // NaN
            ms < 0 ||                                    // Negative values
            !isFinite(ms)                               // Infinity, undefined, null
        ) {
            throw new Error("Input must be a finite, non-negative number representing milliseconds.");
        }

        // Convert ms to minutes and round to 2 decimal places
        return parseFloat((ms / 60000).toFixed(2));
    }
} 