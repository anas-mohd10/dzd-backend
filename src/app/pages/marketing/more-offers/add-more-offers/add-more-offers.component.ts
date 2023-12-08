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
    })
  }

  getProducts(){

  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }


  }
}
