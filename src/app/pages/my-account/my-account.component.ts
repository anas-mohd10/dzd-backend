import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  appRoute = appRoutes
  adminDetails: any = {}
  form: FormGroup
  isValid: boolean = true
  isTouched: boolean = false

  constructor(
    private AdminUsersService: AdminUsersService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl(''),
      countryCode: new FormControl(''),
      mobile: new FormControl('')
    })

    this.AdminUsersService.getAdminDetails({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.adminDetails = res?.result
        this.adminDetails.createdAt = new Date(this.adminDetails.createdAt).toString()
        this.ChangeDetectorRef.markForCheck()

        for (let key of Object.keys(this.adminDetails)) {
          this.form.get(key)?.setValue(this.adminDetails[key])
        }
      }
    })
  }

  touchAction(action: any) {
    switch (action) {
      case true:
        this.isTouched = true
        break
      case false:
        this.isTouched = false
        break
      default:
        this.isTouched = true
        break
    }
  }

  editDetails() {
    if (!this.form.valid) {
      this.isValid = false
      return
    }

    this.AdminUsersService.updateAdminUser(this.adminDetails?.slug, this.form.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ngOnInit()
        this.isValid = true
      }
    })
  }

}
