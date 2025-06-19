import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { ErpSettingsService } from 'src/app/includes/services/erp-settings.service';

interface ErpFieldConfig {
  controlName: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
}

@Component({
  selector: 'app-erp-settings-list',
  templateUrl: './erp-settings-list.component.html',
  styleUrls: ['./erp-settings-list.component.scss']
})
export class ErpSettingsListComponent implements OnInit {
  onToggleErpEnable(erpId: string, event: any) {
    if (this.allErpSettings) {
      const enabledField = `${erpId}Enabled`;
      this.allErpSettings[enabledField] = event.target.checked;
      // Optionally, call an update method here if individual toggles should persist immediately
      // this.erpSettingsService.updateErpSettings(this.allErpSettings).subscribe(...);
      // For now, we'll update the local state and save when the modal form is submitted
      const erpInList = this.erpList.find(e => e.id === erpId);
      if (erpInList) {
        erpInList.enabled = event.target.checked;
      }
    }
  }
  @ViewChild('erpSettingsTemplate') erpSettingsTemplate!: TemplateRef<any>;

  appRoute = appRoutes;
  form: FormGroup;
  isSubmitted = false;
  isLoading = false;
  allErpSettings: any = {}; // To store all fetched ERP settings

  erpList = [
    { id: 'odoo', name: 'Odoo', enabled: false },
    { id: 'zoho', name: 'Zoho', enabled: false },
    { id: 'sap', name: 'SAP', enabled: false },
    // Add more ERP configs here
  ];

  selectedErp: string | null = null;
  selectedErpName: string = '';
  selectedErpFields: ErpFieldConfig[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private erpSettingsService: ErpSettingsService,
    private hotToastService: HotToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({});
    this.fetchAndInitializeErpSettings();
  }

  fetchAndInitializeErpSettings() {
    this.isLoading = true;
    this.erpSettingsService.getErpSettings().subscribe({
      next: (res: any) => {
        this.allErpSettings = res.result?.settings || {};
        // Update enabled status in erpList
        this.erpList = this.erpList.map(erp => ({
          ...erp,
          enabled: !!this.allErpSettings[`${erp.id}Enabled`]
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.hotToastService.error('Failed to fetch ERP settings');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  openErpModal(erpId: string) {
    this.selectedErp = erpId;
    this.selectedErpName = this.erpList.find(e => e.id === erpId)?.name || erpId;
    this.form = this.formBuilder.group({}); // Reset form

    // Use allErpSettings to populate the form
    this.buildFormFromErp(erpId, this.allErpSettings);
    this.modalService.open(this.erpSettingsTemplate, { size: 'lg', backdrop: 'static' });
  }

  buildFormFromErp(erpId: string, currentSettings: any) {
    const fieldsMap: { [key: string]: ErpFieldConfig[] } = {
      odoo: [
        { controlName: 'odooUrl', label: 'Odoo URL', placeholder: 'https://your-odoo.com', type: 'text', required: true },
        { controlName: 'odooDb', label: 'Odoo DB Name', placeholder: 'odoo_db', type: 'text', required: true },
        { controlName: 'odooUsername', label: 'Odoo Username', placeholder: 'admin', type: 'text', required: true },
        { controlName: 'odooPassword', label: 'Odoo Password / API Key', placeholder: '••••••••', type: 'password', required: false },
        { controlName: 'odooEnabled', label: 'Enabled', placeholder: '', type: 'checkbox', required: false }
      ],
      zoho: [
        { controlName: 'zohoUrl', label: 'Zoho URL', placeholder: 'https://zoho.com', type: 'text', required: true },
        { controlName: 'zohoToken', label: 'Zoho API Token', placeholder: 'your-token', type: 'text', required: true },
        { controlName: 'zohoEnabled', label: 'Enabled', placeholder: '', type: 'checkbox', required: false }
      ],
      sap: [
        { controlName: 'sapUrl', label: 'SAP URL', placeholder: 'https://sap.com', type: 'text', required: true },
        { controlName: 'sapClientId', label: 'SAP Client ID', placeholder: 'client-id', type: 'text', required: true },
        { controlName: 'sapEnabled', label: 'Enabled', placeholder: '', type: 'checkbox', required: false }
      ]
      // Define fields for other ERPs similarly
    };

    this.selectedErpFields = fieldsMap[erpId] || [];
    const newFormGroup: { [key: string]: any } = {};

    for (const field of this.selectedErpFields) {
      newFormGroup[field.controlName] = [
        currentSettings[field.controlName] || (field.type === 'checkbox' ? false : ''),
        field.required ? Validators.required : null
      ];
    }
    this.form = this.formBuilder.group(newFormGroup);
  }

  onSubmitErp() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      this.hotToastService.error('Please fill all required fields');
      return;
    }

    // Merge form values into the allErpSettings object
    const updatedSettings = { ...this.allErpSettings, ...this.form.value };

    this.erpSettingsService.updateErpSettings(updatedSettings).subscribe({
      next: () => {
        this.hotToastService.success('ERP settings saved successfully!');
        this.allErpSettings = updatedSettings; // Update local cache
         // Update enabled status in erpList after saving
        this.erpList = this.erpList.map(erp => ({
          ...erp,
          enabled: !!this.allErpSettings[`${erp.id}Enabled`]
        }));
        this.modalService.dismissAll();
        this.form.markAsPristine();
        this.isSubmitted = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.hotToastService.error('Failed to save ERP settings');
        console.error(err);
      }
    });
  }
}
