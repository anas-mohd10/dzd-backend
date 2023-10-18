import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { TaxRulesService } from 'src/app/includes/services/tax-rules.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tax-rules',
  templateUrl: './tax-rules-list.component.html',
  styleUrls: ['./tax-rules-list.component.scss'],
})

export class TaxRulesComponent implements OnInit {
  limit: FormControl = new FormControl(40);
  page: number = 1
  rules: Array<any> = []
  keyword: FormControl = new FormControl('')
  isLastPage: boolean = true
  appRoute = appRoutes
  modalRef?: BsModalRef
  ruleDetails: any = {}

  constructor(
    private TaxRulesService: TaxRulesService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getRules()
  }

  open(template: TemplateRef<any>, rule: any) {
    this.ruleDetails = rule
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' })
  }

  confirm() {
    this.TaxRulesService.deleteRule(this.ruleDetails.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getRules()
          this.modalRef?.hide()
          this.ToastrService.success(res.message);
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message);
      }
    })
  }

  navBack() {
    this.page -= 1
  }

  navNext() {
    this.page += 1
  }

  getRules() {
    this.TaxRulesService.searchRules({ page: this.page, limit: this.limit.value, keyword: this.keyword.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.rules = res?.result?.data;
          this.isLastPage = res?.result?.isLastPage;
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message);
      }
    })
  }
}
