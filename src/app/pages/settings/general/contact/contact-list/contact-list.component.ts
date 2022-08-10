import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { ContactsService } from 'src/app/includes/services/contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  appRoute = appRoutes
  contactsData: any

  constructor(
    private contactsService: ContactsService
  ) { }

  ngOnInit(): void {
    this.getContacts()
  }

  getContacts() {
    this.contactsService.getContacts().subscribe((res: any) => {
      this.contactsData = res?.result
    })
  }

}
