import {
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { CsvService } from 'src/app/includes/services/csv.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-export-logs-list',
    templateUrl: './export-logs-list.component.html',
    styleUrls: ['./export-logs-list.component.scss'],
})
export class ExportLogsListComponent implements OnInit {
    appRoute = appRoutes;
    fileExports: Array<any> = [];
    status: FormControl = new FormControl('');
    isLastPage: boolean = false;
    totalPages: number = 0;
    totalResults: number = 0;
    page: number = 1;
    limit: number = 20;
    statusFilters: Array<{ title: string; status: string }> = [
        { title: 'All', status: '' },
        { title: 'Processing', status: 'processing' },
        { title: 'Completed', status: 'completed' },
        { title: 'Completed with Errors', status: 'completed_with_errors' },
        { title: 'Failed', status: 'failed' },
        { title: 'Awaiting', status: 'awaiting' },
    ];
    baseUrl = `${environment.apiUrl}/downloadExportLog/`;

    constructor(
        private CsvService: CsvService,
        private ChangeDetectorRef: ChangeDetectorRef,
        private HotToastService: HotToastService,
    ) { }

    formatDate(date: string) {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    formatTime(time: string) {
        return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
    }

    ngOnInit(): void {
        this.fetchFileExports();
    }

    onPageTriggered(event: { pageIndex: number; pageSize: number }) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.fetchFileExports();
    }

    clearFilters() {
        this.status.setValue('');
        this.page = 1;
        this.fetchFileExports();
    }

    fetchFileExports() {
        this.CsvService.getFileExports(this.page, this.limit, this.status.value).subscribe({
            next: (res: any) => {
                if (res?.success && res?.errorCode === 0) {
                    this.fileExports = res?.result?.data || [];
                    this.totalPages = res?.result?.totalPages;
                    this.totalResults = res?.result?.totalResults;
                    this.isLastPage = res?.result?.isLastPage;
                } else {
                    this.fileExports = [];
                    this.HotToastService.error(res?.message || 'Failed to fetch export logs');
                }
                this.ChangeDetectorRef.markForCheck();
            },
            error: (err: any) => {
                this.HotToastService.error(err?.error?.message || 'Failed to fetch export logs');
            },
        });
    }

    downloadExportFile(exportId: string, fileName: string) {
        this.CsvService.downloadExportFile(exportId).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                this.HotToastService.success('File downloaded successfully');
            },
            error: (err: any) => {
                this.HotToastService.error(err?.error?.message || 'Failed to download file');
            },
        });
    }

    convertMillisecondsToMinutes(milliseconds: string) {
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