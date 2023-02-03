import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-add-shipping',
  templateUrl: './add-shipping.component.html',
  styleUrls: ['./add-shipping.component.scss']
})
export class AddShippingComponent implements OnInit {

  shippingform: any
  appRoutes = appRoutes
  charges: any = []
  editMode: any = PageTasks.ADD
  isSubmitted = false;

  from: any = new FormControl()
  to: any = new FormControl()
  price: any = new FormControl()
  isInvalid: boolean = false;

  constructor(private toast: ToastrService) { }

  ngOnInit(): void {
    this.initForm()
  }

  get sf() {
    return this.shippingform.controls;
  }

  initForm() {
    this.shippingform = new FormGroup({
      name: new FormControl('', Validators.required),
      days: new FormControl('', Validators.required),
      transitTime: new FormControl(''),
      url: new FormControl(''),
      isActive: new FormControl(true),
    })
  }

  validateValue(key: any) {
    switch (key) {
      case 1:
        const to = this.to?.value
        const from = this.from?.value
        if (to < from) {
          this.isInvalid = true
        }
        break
      case 2:
        const to2 = this.to?.value
        const from2 = this.from?.value
        if (to2 < from2) {
          this.isInvalid = true
        }
        break
    }
  }

  addData() {
    if (this.from?.value != null && this.to?.value != null) {
      if (this.price?.value != null) {
        this.charges.push({
          id: this.charges.length,
          from: this.from?.value,
          to: this.to?.value,
          price: this.price?.value
        })
      } else {
        this.toast.error('Price is required')
      }
    } else {
      this.toast.error('From & To value required')
    }
  }

  onSubmit() { }

}
