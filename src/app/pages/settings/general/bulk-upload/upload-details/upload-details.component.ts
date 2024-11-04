import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CsvService } from 'src/app/includes/services/csv.service';

interface UploadDetails {
  estimatedTimeRemaining: number
  totalRecords: number
  status: string  
  processedRecords: number
  logs: string[]
  executionTime: number
  location: string
  title: string
}

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss']
})
export class UploadDetailsComponent implements OnInit {
  uploadId: string;
  appRoute = appRoutes
  uploadDetails: UploadDetails

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private CsvService: CsvService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.uploadId = this.ActivatedRoute.snapshot.params.uploadId || ''

    this.CsvService.getFileImportDetails(this.uploadId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.uploadDetails = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  formatStatus(status: string) {
    return `${status[0].toUpperCase()}${status.slice(1)}`
  }
}
