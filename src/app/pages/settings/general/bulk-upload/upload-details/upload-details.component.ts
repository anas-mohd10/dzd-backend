import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CsvService } from 'src/app/includes/services/csv.service';

interface UploadDetails {
  estimatedTimeRemaining: number;
  totalRecords: number;
  status: string;
  processedRecords: number;
  skippedRecords: number;
  logs: string[];
  executionTime: number;
  file: string;
  title: string;
  startTime: string;
  endTime: string;
  createdBy?: {
    email: string;
    firstname: string;
    lastname: string
  }
}

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss'],
})
export class UploadDetailsComponent implements OnInit {
  uploadId: string;
  appRoute = appRoutes;
  uploadDetails: UploadDetails;
  logs: Array<any> = [];
  logDetails: any = {};

  totalResults: number = 0;
  totalPages: number = 1;
  pageIndex: number = 1;
  pageSize: number = 100;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private CsvService: CsvService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.uploadId = this.ActivatedRoute.snapshot.params.uploadId || '';

    this.CsvService.getFileImportDetails(this.uploadId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.uploadDetails = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else { }
      }, error: (err: any) => { },
    });

    this.fetchLogs();
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  formatTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
  }

  onPageTriggered(event: {pageIndex: number, pageSize: number}) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchLogs();
  }

  fetchLogs() {
    this.CsvService.fetchLogs(
      this.uploadId, 
      this.pageIndex, 
      this.pageSize
    ).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.logDetails = res.result;
          this.logs = res.result.results;
          this.totalResults = res.result.totalResults;
          this.totalPages = res.result.totalPages;
          this.ChangeDetectorRef.markForCheck();
        }
      }, error: (err: any) => {
        console.error('Error fetching logs:', err);
      },
    })
  }

  reloadLogs() {
    this.fetchLogs();
  }

  getMinutes(seconds: number) {
    return Math.floor(seconds / 60);
  }

  formatStatus(status: string) {
    return `${status[0].toUpperCase()}${status.slice(1)}`;
  }
}
