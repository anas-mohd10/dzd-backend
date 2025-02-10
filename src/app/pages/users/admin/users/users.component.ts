import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { appRoutes } from "../../../../config/routes/app.routes"
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  appRoute = appRoutes
  page: number = 1
  limit: number = 30
  totalResults: number = 0
  totalPages: number = 1

  users: Array<any> = []
  modalRef?: BsModalRef
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  adminDetails: any = {}

  constructor(
    private AdminUsersService: AdminUsersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.getAdminUsers()
  }

  onPageTriggered(event: { pageSize: number, pageIndex: number }) {
    this.limit = event.pageSize
    this.page = event.pageIndex
    this.getAdminUsers()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.getAdminUsers()
  }

  getFormatDate(date: any) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  getFormatTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  onSearch() {
    setTimeout(() => {
      this.getAdminUsers()
    }, 800)
  }

  getAdminUsers() {
    this.AdminUsersService.searchAdmins({
      keyword: this.keyword.value,
      isActive: this.isActive.value,
      page: this.page,
      limit: this.limit
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.users = res?.result?.data
          this.totalResults = res?.result?.totalResults
          this.page = res?.result?.page
          this.ChangeDetectorRef.detectChanges()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  open(template: TemplateRef<any>, adminDetails: any) {
    this.adminDetails = adminDetails
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  confirm() {
    this.AdminUsersService.deleteAdmin({ email: this.adminDetails.email }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.decline()
          this.getAdminUsers()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
      }
    })
  }

  decline() {
    this.modalRef?.hide()
    this.adminDetails = {}
  }

}
