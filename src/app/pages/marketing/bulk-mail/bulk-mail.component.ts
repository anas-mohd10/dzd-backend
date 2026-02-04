import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { EmailGatewaysService } from 'src/app/includes/services/email-gateways.service';

@Component({
    selector: 'app-bulk-mail',
    templateUrl: './bulk-mail.component.html',
    styleUrls: ['./bulk-mail.component.scss']
})
export class BulkMailComponent implements OnInit {
    appRoute = appRoutes;
    form: FormGroup = new FormGroup({});
    gateways: any[] = [];
    isSubmitted = false;

    editorConfig = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '5rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
    };

    constructor(
        private emailGatewaysService: EmailGatewaysService,
        private hotToastService: HotToastService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.fetchGateways();
    }

    get formControls() {
        return this.form.controls;
    }

    initForm() {
        this.form = new FormGroup({
            subject: new FormControl('', [Validators.required]),
            gatewayId: new FormControl('', [Validators.required]),
            htmlContent: new FormControl('', [Validators.required]),
            // Future: User list/segment selection
        });
    }

    fetchGateways() {
        this.emailGatewaysService.getGateways().subscribe({
            next: (response: any) => {
                if (response.errorCode === 0) {
                    // Only show enabled gateways
                    this.gateways = response.result.filter((g: any) => g.isEnabled);

                    // Select default if exists
                    const defaultGateway = this.gateways.find(g => g.isDefault);
                    if (defaultGateway) {
                        this.form.patchValue({ gatewayId: defaultGateway._id });
                    } else if (this.gateways.length > 0) {
                        this.form.patchValue({ gatewayId: this.gateways[0]._id });
                    }
                    this.cdr.markForCheck();
                }
            },
            error: (err: any) => {
                this.hotToastService.error('Failed to load email gateways');
            }
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }

        // Call service to send bulk email (placeholder endpoint for now)
        // this.emailGatewaysService.sendBulk(this.form.value).subscribe(...)
        this.hotToastService.info('Bulk sending feature will be connected to API soon.');
    }
}
