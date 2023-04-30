import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-bulk-options',
  templateUrl: './bulk-options.component.html',
  styleUrls: ['./bulk-options.component.scss']
})
export class BulkOptionsComponent implements OnInit {
  history: any = []

  constructor(
    private AdminUsersService: AdminUsersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.AdminUsersService.getAdminDetails({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.history = res?.result?.uploads
        for (let data of this.history) {
          data.date = new Date(data.date).toLocaleString()
        }
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  downloadFile(data: any, name: any) {
    let url: any = environment.base + "/" + data
    fetch(url).then((resp: any) => {
      var blob = new Blob([resp], { type: 'application/csv' });
      var filename = name;
      var link: any = document.createElement('download');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }).catch((error: any) => {
      this.ToastrService.error("Couldn't download the file")
    })
  }

}
