import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { ContactsService } from 'src/app/includes/services/contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  appRoute = appRoutes
  contacts: Array<any> = []
  page: number = 1
  limit: FormControl = new FormControl(20)
  isLastPage: boolean = false
  keyword: FormControl = new FormControl('')
  totalPages: number = 1

  constructor(
    private ContactsService: ContactsService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getContacts()
  }

  getNextPage() {
    this.page += 1
    this.getContacts()
  }

  getPreviousPage() {
    this.page -= 1
    this.getContacts()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.page = 1
    this.limit.setValue(20)
    this.getContacts()
  }

  getContacts() {
    let payload = {
      page: this.page,
      limit: this.limit.value,
      keyword: this.keyword.value
    }

    this.ContactsService.searchContacts(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.contacts = res?.result?.data
        this.page = res?.result?.page
        this.isLastPage = res?.result?.isLastPage
        this.totalPages = res?.result?.totalPages
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
