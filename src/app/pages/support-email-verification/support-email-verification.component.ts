import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { HelpCenterService } from 'src/app/includes/services/help-center.service';

@Component({
  selector: 'app-support-email-verification',
  templateUrl: './support-email-verification.component.html',
  styleUrls: ['./support-email-verification.component.scss']
})
export class SupportEmailVerificationComponent implements OnInit {
  token: string = ''
  appRoute = appRoutes

  constructor(
    private Service: HelpCenterService,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.token = this.ActivatedRoute.snapshot.params['token'] || ''
    this.Service.verifyEmail({ token: this.token }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.helpcenter.HELPCENTER])
          this.ToastrService.success(res.message)
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.error?.message)
      }
    })
  }

}
