import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { SmsTemplateService } from 'src/app/includes/services/sms-template.service';

@Component({
  selector: 'app-sms-templates',
  templateUrl: './sms-templates.component.html',
  styleUrls: ['./sms-templates.component.scss'],
})
export class SmsTemplatesComponent implements OnInit {
  appRoute = appRoutes;
  isSubmitted: boolean = false;
  templateType: string;
  templates: Array<any> = [
    {
      title: 'Authentication',
      type: 'authentication',
      description: 'SMS templates for authentication purposes',
      templates: [
        {
          title: 'Registration OTP',
          type: 'registration-otp',
          defaultMessage: 'Your registration OTP is {{otp}}. Valid for 10 minutes.'
        },
        {
          title: 'Login OTP',
          type: 'login',
          defaultMessage: 'Your login OTP is {{otp}}. Valid for 5 minutes.'
        },
        {
          title: 'Guest OTP',
          type: 'guest-otp',
          defaultMessage: 'Your guest login OTP is {{otp}}. Valid for 5 minutes.'
        }
      ]
    },
    {
      title: 'Order Updates',
      type: 'orders',
      description: 'SMS templates for order status updates',
      templates: [
        {
          title: 'Order Confirmation',
          type: 'order-confirmation',
          defaultMessage: 'Your order #{{orderNo}} has been confirmed. Total amount: {{amount}}.'
        },
        {
          title: 'Order Accepted',
          type: 'order-accepted',
          defaultMessage: 'Your order #{{orderNo}} has been accepted. Estimated delivery time: {{estimatedTime}}.'
        },
        {
          title: 'Order Packed',
          type: 'order-packed',
          defaultMessage: 'Your order #{{orderNo}} has been packed and will be shipped soon.'
        },
        {
          title: 'Order Shipped',
          type: 'order-shipped',
          defaultMessage: 'Your order #{{orderNo}} has been shipped. Tracking ID: {{trackingId}}'
        },
        {
          title: 'Out for Delivery',
          type: 'order-out-for-delivery',
          defaultMessage: 'Your order #{{orderNo}} is out for delivery. Expected delivery time: {{estimatedTime}}'
        },
        {
          title: 'Order Delivered',
          type: 'order-delivered',
          defaultMessage: 'Your order #{{orderNo}} has been delivered. Thank you for shopping with us!'
        },
        {
          title: 'Order Cancelled',
          type: 'order-cancellation',
          defaultMessage: 'Your order #{{orderNo}} has been cancelled. Reason: {{reason}}'
        },
        {
          title: 'Order Failed',
          type: 'order-failed',
          defaultMessage: 'Your order #{{orderNo}} could not be processed. Reason: {{reason}}'
        }
      ]
    },
    {
      title: 'Cart & Promotions',
      type: 'cart-promo',
      description: 'SMS templates for cart and promotional messages',
      templates: [
        {
          title: 'Abandoned Cart',
          type: 'cart',
          defaultMessage: 'Still thinking about {{productName}}? Complete your purchase now for {{amount}}!'
        },
        {
          title: 'Product Status',
          type: 'product-status-update',
          defaultMessage: 'Status update for {{productName}}: {{status}}'
        }
      ]
    }
  ];
  templateItems: Array<any> = [];
  form: FormGroup;

  constructor(
    private smsTemplateService: SmsTemplateService,
    private toast: HotToastService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get formControls() {
    return this.form.controls;
  }

  selectedTemplate: any;
  templateVariables: { [key: string]: string[] } = {
    'registration-otp': ['{{otp}}'],
    'login': ['{{otp}}'],
    'guest-otp': ['{{otp}}'],
    'order-confirmation': ['{{orderNo}}', '{{amount}}'],
    'order-accepted': ['{{orderNo}}', '{{estimatedTime}}'],
    'order-packed': ['{{orderNo}}'],
    'order-shipped': ['{{orderNo}}', '{{trackingId}}'],
    'order-out-for-delivery': ['{{orderNo}}', '{{estimatedTime}}'],
    'order-delivered': ['{{orderNo}}'],
    'order-cancellation': ['{{orderNo}}', '{{reason}}'],
    'order-failed': ['{{orderNo}}', '{{reason}}'],
    'cart': ['{{productName}}', '{{amount}}'],
    'product-status-update': ['{{productName}}', '{{status}}']
  };

  ngOnInit(): void {
    this.templateType = this.activatedRoute.snapshot.queryParams.type || 'authentication';
    this.templateItems = this.templates.find(
      (template) => template.type == this.templateType
    ).templates;
    console.log(this.templateItems)
    this.selectedTemplate = this.templateItems[0];

    this.form = new FormGroup({
      message: new FormControl('', [Validators.required, Validators.maxLength(160)]),
      type: new FormControl(this.templateItems[0].type, Validators.required),
      isActive: new FormControl(true)
    });

    this.getTemplateDetails(this.templateItems[0].type);
  }

  toggleTemplate(template: any) {
    this.selectedTemplate = template;
    this.form.patchValue({
      message: template.defaultMessage || '',
      type: template.type,
      isActive: true
    });
    this.getTemplateDetails(template.type);
    this.isSubmitted = false;
  }

  selectCategory(type: string) {
    this.templateType = type;
    this.templateItems = this.templates.find(
      (template) => template.type === type
    ).templates;

    // Select the first template of the category by default
    if (this.templateItems.length > 0) {
      this.toggleTemplate(this.templateItems[0]);
    }
  }

  insertVariable(variable: string) {
    const currentMessage = this.form.get('message')?.value || '';
    this.form.patchValue({
      message: currentMessage + ' ' + variable
    });
  }

  getTemplateDetails(type: string) {
    this.smsTemplateService.getTemplate(type).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result);
          this.changeDetectorRef.markForCheck();
        }
      },
    });
  }

  manageTemplate() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.smsTemplateService.manageTemplate(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getTemplateDetails(this.form.value.type);
          this.toast.success(res?.message);
          this.isSubmitted = false;
        } else {
          this.toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message);
      },
    });
  }
}
