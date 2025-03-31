import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { formSettingsEndpoints } from 'src/app/config/endpoints';
import { FieldMap } from 'src/app/pages/settings/general/form-settings/fieldsMap';

@Injectable({
  providedIn: 'root'
})
export class FormSettingsService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createFormSettings(formData: { form: string, fields: FieldMap[] }) {
    const url = this.CommonService.getFullUrl(formSettingsEndpoints.formSettings);
    return this.HttpClient.post(url, formData);
  }

  getFormSettings(formId: string) {
    const url = this.CommonService.getFullUrl(formSettingsEndpoints.formSettings + `/${formId}`);
    return this.HttpClient.get(url);
  }

  updateFormSettings(formId: string, formData: { form: string, fields: FieldMap[] }) {
    const url = this.CommonService.getFullUrl(formSettingsEndpoints.formSettings + `/${formId}`);
    return this.HttpClient.put(url, formData);
  }
}