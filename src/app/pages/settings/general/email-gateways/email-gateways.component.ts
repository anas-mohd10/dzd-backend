import {
    ChangeDetectorRef,
    Component,
    OnInit,
    TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { EmailGatewaysService } from 'src/app/includes/services/email-gateways.service';
import { environment } from 'src/environments/environment';

interface EmailGateway {
    title: string;
    id: string;
    icon: string;
}

@Component({
    selector: 'app-email-gateways',
    templateUrl: './email-gateways.component.html',
    styleUrls: ['./email-gateways.component.scss'],
})
export class EmailGatewaysComponent implements OnInit {
    appRoute = appRoutes;
    activeGatewayDetails: any;
    gatewayDetails: any;
    emailGateways: Array<any> = [];
    isSubmitted: boolean = false;
    form: FormGroup = new FormGroup({});
    modalRef?: BsModalRef;

    // Define available gateways
    availableGateways: Array<EmailGateway> = [
        { title: 'Mailchimp', id: 'mailchimp', icon: `assets/media/svg/brand-logos/mailchimp.svg` },
        { title: 'Klaviyo', id: 'klaviyo', icon: `assets/media/svg/brand-logos/klaviyo.svg` },
        { title: 'SendGrid', id: 'sendgrid', icon: `assets/media/svg/brand-logos/sendgrid.svg` }
    ];

    // Configuration fields for each gateway
    gatewayConfig: any = {
        mailchimp: ['apiKey', 'serverPrefix'],
        klaviyo: ['privateApiKey', 'publicApiKey'],
        sendgrid: ['apiKey']
    };

    constructor(
        private emailGatewaysService: EmailGatewaysService,
        private hotToastService: HotToastService,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService
    ) { }

    get formControls() {
        return this.form.controls;
    }

    ngOnInit(): void {
        this.initForm();
        this.fetchGateways();
    }

    initForm() {
        this.form = new FormGroup({
            gatewayName: new FormControl('', Validators.required),
            displayName: new FormControl(''),
            apiKey: new FormControl(''),
            apiSecret: new FormControl(''),
            serverPrefix: new FormControl(''), // For Mailchimp (e.g., us19)
            privateApiKey: new FormControl(''), // For Klaviyo
            publicApiKey: new FormControl(''), // For Klaviyo
            fromEmail: new FormControl('', [Validators.email]),
            fromName: new FormControl(''),
            isEnabled: new FormControl(false),
            isDefault: new FormControl(false)
        });
    }

    fetchGateways() {
        this.emailGatewaysService.getGateways().subscribe({
            next: (response: any) => {
                if (response.errorCode == 0) {
                    this.emailGateways = response.result || [];
                    this.cdr.markForCheck();
                } else {
                    this.hotToastService.error(response.message);
                }
            },
            error: (error: any) => {
                this.hotToastService.error(error.error.message || 'Failed to fetch gateways');
            },
        });
    }

    isGatewayEnabled(gatewayId: string) {
        return this.emailGateways?.some((g: any) => g.gatewayName == gatewayId && g.isEnabled);
    }

    isDefaultGateway(gatewayId: string): boolean {
        const gateway = this.emailGateways?.find((g: any) => g.gatewayName === gatewayId);
        return gateway ? gateway.isDefault : false;
    }

    open(template: TemplateRef<any>, gatewayId: string) {
        this.modalRef = this.modalService.show(template, {
            class: 'modal-dialog-centered modal-lg',
            ignoreBackdropClick: true,
        });
        this.onGatewayChange(gatewayId);
    }

    close() {
        this.modalRef?.hide();
        this.form.reset();
        this.form.patchValue({
            isEnabled: false,
            isDefault: false
        });
        this.isSubmitted = false;
    }

    onGatewayChange(gatewayId: string) {
        this.activeGatewayDetails = this.availableGateways.find((g) => g.id == gatewayId);
        this.form.patchValue({
            displayName: this.activeGatewayDetails?.title,
            gatewayName: gatewayId,
        });

        // Fetch details for specific gateway
        this.emailGatewaysService.getGatewayDetails(gatewayId).subscribe({
            next: (response: any) => {
                if (response.errorCode == 0) {
                    this.gatewayDetails = response.result;
                    if (this.gatewayDetails) {
                        this.form.patchValue(this.gatewayDetails);
                    }
                    this.cdr.markForCheck();
                }
            },
            error: (error: any) => {
                // Only show error if it's not a 404 (not found is expected for new gateways)
                if (error.status !== 404) {
                    this.hotToastService.error(error.error.message);
                }
            },
        });

        this.updateValidators(gatewayId);
    }

    updateValidators(gatewayId: string) {
        const config = this.gatewayConfig[gatewayId] || [];

        // Clear all distinctive validators first
        ['apiKey', 'serverPrefix', 'privateApiKey', 'publicApiKey'].forEach(field => {
            this.form.get(field)?.clearValidators();
            this.form.get(field)?.updateValueAndValidity();
        });

        // Set required validators based on config
        config.forEach((field: string) => {
            this.form.get(field)?.setValidators([Validators.required]);
            this.form.get(field)?.updateValueAndValidity();
        });
    }

    onSwitchTriggered(event: { switchId: string; toggleState: boolean }) {
        this.form.patchValue({ isEnabled: event.toggleState });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }

        const formData = {
            _id: this.gatewayDetails?._id,
            ...this.form.value,
        };

        this.emailGatewaysService.manage(formData).subscribe({
            next: (response: any) => {
                if (response.errorCode == 0) {
                    this.hotToastService.success(response.message);
                    this.close();
                    this.fetchGateways();
                } else {
                    this.hotToastService.error(response.message);
                }
            },
            error: (err: any) => {
                this.hotToastService.error(err.error.message);
            },
        });
    }

    getGatewayIcon(gatewayId: string) {
        const gateway = this.availableGateways.find(g => g.id === gatewayId);
        return gateway ? gateway.icon : 'assets/media/svg/brand-logos/cod.svg'; // Fallback icon
    }
}
