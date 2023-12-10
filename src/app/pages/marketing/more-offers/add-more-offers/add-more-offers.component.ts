import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-add-more-offers',
  templateUrl: './add-more-offers.component.html',
  styleUrls: ['./add-more-offers.component.scss']
})
export class AddMoreOffersComponent implements OnInit {
  appRoute = appRoutes
  editMode: boolean = false
  form: FormGroup
  isSubmitted: boolean = false
  startDate: string;
  endDate: string;
  applicableItems: Array<any> = [
    { key: 'cart', value: 'Cart' },
    { key: 'product', value: 'Product' },
    { key: 'category', value: 'Category' },
    { key: 'brand', value: 'Brand' }
  ]
  applicableItem: string;
  getItems: Array<any> = [
    { key: 'product', value: 'Product' },
    { key: 'category', value: 'Category' },
    { key: 'brand', value: 'Brand' }
  ]

  constructor(
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      type: new FormControl('percentage'),
      amount: new FormControl('100', Validators.required),
      applicableItem: new FormControl('product', Validators.required),
    })
  }

  handleApplicableItem(event: any) {
    this.applicableItem = event.target.value
  }

  handleOfferType() {
    this.form.get('type')?.value == 'flat'
      ? this.form.get('amount')?.setValue(0)
      : this.form.get('amount')?.setValue(100)
  }

  getProducts() {

  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }


  }
}
