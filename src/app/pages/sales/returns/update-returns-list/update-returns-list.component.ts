import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { ReturnsService } from 'src/app/includes/services/returns.service';

@Component({
  selector: 'app-update-returns-list',
  templateUrl: './update-returns-list.component.html',
  styleUrls: ['./update-returns-list.component.scss']
})
export class UpdateReturnsListComponent implements OnInit {
  task = PageTasks.UPDATE
  appRoute = appRoutes
  editMode = false;
  orderNumber: any;
  returnForm: any;
  returnData: any;
  status: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private returnsService: ReturnsService
  ) { }

  ngOnInit(): void {
    this.orderNumber = this.route.snapshot.queryParams.order || ''
    this.initForm()
    this.managePage()
    this.getReturnList()
    this.disableInput()
  }

  disableInput() {
    this.returnForm.get("order").disable()
    this.returnForm.get("product").disable()
    this.returnForm.get("reason").disable()
    this.returnForm.get("description").disable()
    this.returnForm.get("quantity").disable()
  }

  getReturnList() {
    this.returnsService.getReturnList(this.orderNumber).subscribe((res: any) => {
      this.returnData = res?.result[0]
      this.status = res?.result[0]?.status
      this.returnForm.get("order")?.setValue(res?.result[0]?.order)
      this.returnForm.get("product")?.setValue(res?.result[0]?.product)
      this.returnForm.get("reason")?.setValue(res?.result[0]?.reason)
      this.returnForm.get("description")?.setValue(res?.result[0]?.description)
      this.returnForm.get("status")?.setValue(res?.result[0]?.status)
      this.returnForm.get("quantity")?.setValue(res?.result[0]?.quantity)
    })
  }

  initForm() {
    this.returnForm = this.formBuilder.group({
      order: [''],
      product: [''],
      reason: [''],
      description: [''],
      quantity: [''],
      status: [''],
    });
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  onSubmit() {
    if (!this.returnForm.valid) {
      this.toastr.error('Kindly fill required fields');
      return;
    }

    this.returnsService.updateReturnList(this.orderNumber, this.returnForm.value).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Return status updated successfully');
        this.router.navigate([this.appRoute.returns.RETURN_LIST]);
      }
    })
  }

}
 