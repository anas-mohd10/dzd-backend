import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { FaqService } from 'src/app/includes/services/faq.service';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnInit {
  appRoute = appRoutes
  faqs: Array<any> = []
  activeFaq: number = 1

  constructor(private faqService: FaqService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getFaqs()
  }

  getFaqs() {
    this.faqService.getFaqs().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.faqs = res?.result
        this.cdr.markForCheck()
      }
    })
  }

  toggleContent(index: any) {
    this.activeFaq == index ? this.activeFaq = 0 : this.activeFaq = index
  }
}
