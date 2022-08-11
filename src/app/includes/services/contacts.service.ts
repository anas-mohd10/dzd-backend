import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { contactsEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  contactsEndpoints = contactsEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addContact(data: any) {
    const url = this.commonService.getFullUrl(this.contactsEndpoints.add_contact);
    return this.http.post(`${url}`, data);
  }

  getContacts() {
    const url = this.commonService.getFullUrl(this.contactsEndpoints.get_contact);
    return this.http.get(`${url}`);
  }

  getContactBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.contactsEndpoints.get_contact_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateContact(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.contactsEndpoints.update_contact + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
