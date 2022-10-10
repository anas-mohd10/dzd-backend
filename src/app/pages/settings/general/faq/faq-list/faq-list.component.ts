import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { FaqService } from 'src/app/includes/services/faq.service';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnInit {
  appRoute = appRoutes
  faqData: any

  constructor(private faqService: FaqService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getFaqs()
  }

  getFaqs() {
    this.faqService.getFaqs().subscribe((res: any) => {
      this.faqData = res?.result
      this.cdr.markForCheck()
    })
  }

}
