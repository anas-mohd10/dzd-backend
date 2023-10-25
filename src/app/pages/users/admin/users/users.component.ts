import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { appRoutes } from "../../../../config/routes/app.routes"
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  appRoute = appRoutes
  page: number = 1
  limit: FormControl = new FormControl('20')
  lastPage: boolean = false
  users: Array<any> = []
  totalResults: string = ''
  modalRef?: BsModalRef
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  adminDetails: any = {}
  constructor(
    private AdminUsersService: AdminUsersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAdminUsers()
  }

  getPreviousPage() {
    this.page -= 1
    this.getAdminUsers()
  }

  getNextPage() {
    this.page += 1
    this.getAdminUsers()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.getAdminUsers()
  }

  getAdminUsers() {
    let payload = {
      keyword: this.keyword.value,
      isActive: this.isActive.value,
      page: this.page,
      limit: this.limit.value
    }

    this.AdminUsersService.searchAdmins(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.users = res?.result?.data
        this.totalResults = res?.result?.totalResults
        this.lastPage = res?.result?.lastPage
        this.page = res?.result?.page
        this.ChangeDetectorRef.detectChanges()
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
          this.ToastrService.success(res.message)
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }

  decline() {
    this.modalRef?.hide()
    this.adminDetails = {}
  }

}
