import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { ChangeDetectorRef } from '@angular/core';
import { addressFieldsMap, FieldMap, loginFieldsMap } from './fieldsMap';
import { FormSettingsService } from 'src/app/includes/services/form-settings.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-form-settings',
  templateUrl: './form-settings.component.html',
  styleUrls: ['./form-settings.component.scss']
})
export class FormSettingsComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup = new FormGroup({})
  formField: FormGroup = new FormGroup({})
  formType: FormControl = new FormControl('address')
  isExists: boolean = false
  formDoc: { _id: string, form: string, fields: FieldMap[] } = { _id: '', form: '', fields: [] }

  fields: FieldMap[] = []

  // TODO: Add more form items when the API is ready
  formItems: Array<{ label: string, value: string }> = [
    { label: 'Address', value: 'address' },
  ]

  constructor(
    private FormSettingsService: FormSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      form: new FormControl('address'),
      fields: new FormControl([])
    })

    switch (this.form.value.form) {
      case 'address':
        this.fields = addressFieldsMap
        break
      case 'login':
        this.fields = loginFieldsMap
        break
    }

    this.fetchResults()
  }

  fetchResults() {
    this.FormSettingsService.getFormSettings(this.form.value.form).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          if (Object.keys(res.result).length > 0) {
            this.isExists = true
            this.formDoc = res.result
            this.fields = res.result.fields
          } else {
            this.isExists = false
          }
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.isExists = false
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.isExists = false
        this.HotToastService.error(err.error.message)
      }
    })
  }

  onFieldsChange(fields: FieldMap[]) {
    this.fields = fields
  }

  saveChanges() {
    if (this.isExists) {
      this.updateSettings()
    } else {
      this.createSettings()
    }
  }

  getFields(){
    switch(this.form.value.form){
      case 'address':
        return addressFieldsMap
      case 'login':
        return loginFieldsMap
      default:
        return []
    }
  }

  createSettings() {
    this.fields = this.fields.map((field, index) => ({
      ...field,
      fieldMap: this.getFields()[index].fieldMap
    }))

    this.FormSettingsService.createFormSettings({
      form: this.form.value.form,
      fields: this.fields
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.fetchResults()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  updateSettings() {
    this.fields = this.fields.map((field, index) => ({
      ...field,
      fieldMap: this.getFields()[index].fieldMap
    }))
    
    this.FormSettingsService.updateFormSettings(this.formDoc._id, {
      form: this.form.value.form,
      fields: this.fields
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.fetchResults()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }
}
