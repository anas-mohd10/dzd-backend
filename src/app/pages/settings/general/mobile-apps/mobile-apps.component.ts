import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FaProps } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';


@Component({
  selector: 'app-mobile-apps',
  templateUrl: './mobile-apps.component.html',
  styleUrls: ['./mobile-apps.component.scss']
})
export class MobileAppsComponent implements OnInit {
  appRoute = appRoutes
  details: any
  androidForm: FormGroup
  iosForm: FormGroup
  isSubmitted: boolean = false
  isAndroidDetected: boolean = false
  isIosDetected: boolean = false

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.androidForm = new FormGroup({
      link: new FormControl(''),
      package: new FormControl(''),
      version: new FormControl(''),
      forceUpdate: new FormControl('false'),
      name: new FormControl(''),
      buildName: new FormControl(''),
      buildCode: new FormControl(''),
      appIcon: new FormControl(''),
      splashIcon: new FormControl('')
    })

    this.iosForm = new FormGroup({
      link: new FormControl(''),
      package: new FormControl(''),
      version: new FormControl(''),
      forceUpdate: new FormControl('false'),
      name: new FormControl(''),
      buildName: new FormControl(''),
      buildCode: new FormControl(''),
      appIcon: new FormControl(''),
      splashIcon: new FormControl(''),
      itunesId: new FormControl('')
    })
  }

  getDetails() {

  }

  detechChanges(type: any) {
    type == 'android' ? this.isAndroidDetected = true : this.isIosDetected = true
  }

  onCancel() {
    this.isSubmitted = false
    this.isAndroidDetected = false
    this.isIosDetected = false
    this.initForm()
    this.getDetails()
  }

  saveAndroid() {

  }

  saveIos() {

  }
}
