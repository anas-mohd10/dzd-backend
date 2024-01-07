import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { ReturnsService } from 'src/app/includes/services/returns.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-return-details',
  templateUrl: './return-details.component.html',
  styleUrls: ['./return-details.component.scss']
})
export class ReturnDetailsComponent implements OnInit {
  appRoute = appRoutes;
  returnDetails: any;
  base: string = environment.base
  returnRef: string;
  isRefunded: FormControl = new FormControl('false');
  modalRef: BsModalRef
  deleteRef: BsModalRef
  file: string;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private ReturnsService: ReturnsService,
    private Router: Router,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private Toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.returnRef = this.ActivatedRoute.snapshot.params['id'] || ''
    if (this.returnRef) {
      this.ReturnsService.getReturnDetails(this.returnRef).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.returnDetails = res?.result
            this.isRefunded.setValue(this.returnDetails?.isRefunded)
            this.returnDetails?.isRefunded == true ? this.isRefunded.disable() : null
            this.ChangeDetectorRef.markForCheck()
          } else {

          }
        }, error: (err: any) => {

        }
      })
    }
  }

  open(template: TemplateRef<any>, file: string) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' })
    this.file = file;
  }

  update(template: TemplateRef<any>) {
    this.deleteRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' })
  }

  confirm() {
    this.ReturnsService.updateReturn({ reference: this.returnRef, isRefunded: this.isRefunded.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.deleteRef?.hide()
          this.Router.navigate([appRoutes.returns])
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.message)
      }
    })
  }

  decline() {
    this.deleteRef?.hide()
  }
}
