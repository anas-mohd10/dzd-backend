import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CsvService } from 'src/app/includes/services/csv.service';

interface UploadDetails {
  estimatedTimeRemaining: number;
  totalRecords: number;
  status: string;
  processedRecords: number;
  logs: string[];
  executionTime: number;
  file: string;
  title: string;
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
    return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  fetchLogs() {
    this.CsvService.fetchLogs(this.uploadId, 1).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.logDetails = res.result;
          this.logs = res.result.results;          
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      }, error: (err: any) => { },
    })
  }

  getMinutes(seconds: number) {
    return Math.floor(seconds / 60);
  }

  formatStatus(status: string) {
    return `${status[0].toUpperCase()}${status.slice(1)}`;
  }
}
