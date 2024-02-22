import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { CustomMailerService } from 'src/app/includes/services/custom-mailer.service';

@Component({
  selector: 'app-mailer-details',
  templateUrl: './mailer-details.component.html',
  styleUrls: ['./mailer-details.component.scss'],
})
export class MailerDetailsComponent implements OnInit {
  appRoute = appRoutes;
  isSubmitted: boolean = false;
  mailerType: string;
  mailers: Array<any> = [
    {
      title: 'Newsletter',
      type: 'newsletters',
      description:
        'Mailers related to newsletter such as subscribed, unsubscribed, verification, notification',
      mailers: [
        { title: 'Newsletter subscribed', type: 'newsletter-subscribed' },
        { title: 'Newsletter unsubscribed', type: 'newsletter-unsubscribed' },
        { title: 'Newsletter verification', type: 'newsletter-verification' },
        { title: 'Newsletter notification', type: 'newsletter-notification' },
      ],
    },
    {
      title: 'Orders',
      type: 'orders',
      description:
        'Mailers related to orders such as new order, returns, cancellation',
      mailers: [
        { title: 'Place orders', type: 'place-order' },
        { title: 'Delivered orders', type: 'delivered' },
        { title: 'Cancelled orders', type: 'cancel-order' },
      ],
    },
  ];
  mailerItems: Array<any> = [];
  form: FormGroup;
  bodyContent: SafeHtml;

  constructor(
    private CustomMailerService: CustomMailerService,
    private Toast: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.mailerType = this.ActivatedRoute.snapshot.queryParams.type || 'orders';
    this.mailerItems = this.mailers.find(
      (mailer) => mailer.type == this.mailerType
    ).mailers;
    this.form = new FormGroup({
      subject: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      type: new FormControl(this.mailerItems[0].type, Validators.required),
    });

    this.getMailerDetails(this.mailerItems[0].type);
  }

  toggleMailer(type: string) {
    this.form.patchValue({ subject: '', type: type, email: '' });
    this.getMailerDetails(type);
    this.isSubmitted = false;
  }

  getMailerDetails(type: string) {
    this.CustomMailerService.customMailers(type).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result);
          this.bodyContent = this.extractBodyContent(res?.result?.email);
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  detectEmailChanges() {
    this.bodyContent = this.extractBodyContent(this.form.value.email);
  }

  extractBodyContent(htmlString: string): SafeHtml {
    const bodyStartIndex = htmlString.indexOf('<body>');
    const bodyEndIndex = htmlString.indexOf('</body>');
    if (bodyStartIndex !== -1 && bodyEndIndex !== -1) {
      let subString = htmlString.substring(
        bodyStartIndex + '<body>'.length,
        bodyEndIndex
      );
      return this.sanitizer.bypassSecurityTrustHtml(subString);
    } else {
      return '';
    }
  }

  manageMailer() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.CustomMailerService.manageCustomMailers(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getMailerDetails(this.form.value.type);
          this.Toast.success(res?.message);
          this.isSubmitted = false;
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }
}
