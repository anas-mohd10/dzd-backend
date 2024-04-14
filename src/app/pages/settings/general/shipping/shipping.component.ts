import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { ShippingService } from 'src/app/includes/services/shipping.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  appRoute = appRoutes
  shippingDetails: any = {}
  modalRef?: BsModalRef
  items: Array<any> = [{
    title: 'Highest',
    description: 'The shipping cost will be determined by selecting the highest individual product shipping cost.',
    value: 'highest'
  }, {
    title: 'Lowest',
    description: 'The shipping cost will be determined by selecting the lowest individual product shipping cost.',
    value: 'lowest'
  }, {
    title: 'Total',
    description: 'The shipping cost will be the sum of individual product shipping cost.',
    value: 'total'
  }, {
    title: 'No charge',
    description: 'No shipping charge applicable for the orders',
    value: 'free'
  }, {
    title: 'Minimum',
    description: 'No shipping charges will be applied for orders exceeding the minimum cart amount.',
    value: 'minimum'
  }, {
    title: 'City',
    description: 'The shipping cost will be determined by user delivery address',
    value: 'city'
  }]
  isMinimum: boolean = false
  form: FormGroup

  constructor(
    private ShippingService: ShippingService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private HotToastService: HotToastService
  ) { }

  get formControls() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.getDetails()

    this.form = new FormGroup({
      cost: new FormControl('', Validators.required),
      amount: new FormControl(499, Validators.pattern("^[1-9]*")),
      charge: new FormControl(10, Validators.pattern("^[0-9]*"))
    })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' })
  }

  checked(item: any) {
    this.form.get('cost')?.setValue(item.switchId)
    item.switchId == 'minimum' ? this.isMinimum = true : this.isMinimum = false
    this.ShippingService.manageShipping(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
    this.ChangeDetectorRef.markForCheck()
  }

  save() {
    if (!this.form.valid) {
      return
    }

    this.ShippingService.manageShipping(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
    this.ChangeDetectorRef.markForCheck()
  }

  getDetails() {
    this.ShippingService.shippingDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.shippingDetails = res?.result
          for (let _key of Object.keys(res?.result)) this.form.get(_key)?.setValue(res?.result[_key])
          if (this.shippingDetails?.cost == 'minimum') this.isMinimum = true
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }


}
