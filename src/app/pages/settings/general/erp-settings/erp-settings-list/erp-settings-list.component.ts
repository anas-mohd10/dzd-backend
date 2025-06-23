import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { ErpSettingsService } from 'src/app/includes/services/erp-settings.service';

interface ErpFieldConfig {
  controlName: string;
  settingKey: string;
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
onToggleErpEnable(erpId: string, isChecked: any) {
  const toggleState = isChecked?.toggleState;
  const currentSettings = { ...this.allErpSettings };

  // Update enabled state while preserving other settings
  if (currentSettings.settings && currentSettings.settings[erpId]) {
    currentSettings.settings[erpId].enabled = toggleState;
  }

  // Update toggle in UI
  const erpInList = this.erpList.find(e => e.id === erpId);
  if (erpInList) {
    erpInList.enabled = toggleState;
  }

  this.erpSettingsService.updateErpSettings(currentSettings).subscribe({
    next: () => {
      this.hotToastService.success(`${erpId} integration ${toggleState ? 'enabled' : 'disabled'} successfully`);
    },
    error: (err) => {
      this.hotToastService.error(`Failed to ${toggleState ? 'enable' : 'disable'} ${erpId} integration`);
      console.error(err);
    }
  });
}



  @ViewChild('erpSettingsTemplate') erpSettingsTemplate!: TemplateRef<any>;

  appRoute = appRoutes;
  form: FormGroup;
  isSubmitted = false;
  isLoading = false;
  allErpSettings: any = {}; // To store all fetched ERP settings

  erpList = [
    { id: 'odoo', name: 'Odoo', enabled: false },
    // { id: 'zoho', name: 'Zoho', enabled: false },
    // { id: 'sap', name: 'SAP', enabled: false },
    // Add more ERP configs here
  ];

  selectedErp: string = '';
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
        this.allErpSettings = res.result || {};
        // Update enabled status in erpList
        this.erpList = this.erpList.map(erp => ({
          ...erp,
          enabled: !!this.allErpSettings.settings?.[erp.id]?.enabled
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

    // Pass the correct settings structure to buildFormFromErp
    this.buildFormFromErp(erpId, this.allErpSettings?.settings || {});
    this.modalService.open(this.erpSettingsTemplate, { size: 'lg', backdrop: 'static' });
  }

  buildFormFromErp(erpId: string, currentSettings: any) {
    const fieldsMap: { [key: string]: ErpFieldConfig[] } = {
      odoo: [
        { controlName: 'url', settingKey: 'url', label: 'Odoo URL', placeholder: 'https://your-odoo.com', type: 'text', required: true },
        { controlName: 'db', settingKey: 'db', label: 'Odoo DB Name', placeholder: 'odoo_db', type: 'text', required: true },
        { controlName: 'username', settingKey: 'username', label: 'Odoo Username', placeholder: 'admin', type: 'text', required: true },
        { controlName: 'password', settingKey: 'password', label: 'Odoo Password / API Key', placeholder: '••••••••', type: 'password', required: false },
        { controlName: 'enabled', settingKey: 'enabled', label: 'Enabled', placeholder: '', type: 'checkbox', required: false }
      ],
      zoho: [
        { controlName: 'url', settingKey: 'url', label: 'Zoho URL', placeholder: 'https://zoho.com', type: 'text', required: true },
        { controlName: 'token', settingKey: 'token', label: 'Zoho API Token', placeholder: 'your-token', type: 'text', required: true },
        { controlName: 'enabled', settingKey: 'enabled', label: 'Enabled', placeholder: '', type: 'checkbox', required: false }
      ],
      sap: [
        { controlName: 'url', settingKey: 'url', label: 'SAP URL', placeholder: 'https://sap.com', type: 'text', required: true },
        { controlName: 'clientId', settingKey: 'clientId', label: 'SAP Client ID', placeholder: 'client-id', type: 'text', required: true },
        { controlName: 'enabled', settingKey: 'enabled', label: 'Enabled', placeholder: '', type: 'checkbox', required: false }
      ]
    };

    this.selectedErpFields = fieldsMap[erpId] || [];
    const newFormGroup: { [key: string]: any } = {};

    // Get the ERP settings from the correct path in the response
    const erpSettings = currentSettings?.[erpId] || {};

    for (const field of this.selectedErpFields) {
      const fieldValue = erpSettings[field.settingKey];
      newFormGroup[field.controlName] = [
        fieldValue !== undefined ? fieldValue : (field.type === 'checkbox' ? false : ''),
        field.required ? Validators.required : null
      ];
    }

    this.form = this.formBuilder.group(newFormGroup);
  }

  onSubmitErp() {
    this.isSubmitted = true;
    if (!this.form.valid || !this.selectedErp) {
      this.hotToastService.error('Please fill all required fields');
      return;
    }

    const currentSettings = { ...this.allErpSettings };
    if (!currentSettings.settings) {
      currentSettings.settings = {};
    }
    
    // Update only the selected ERP's settings while preserving existing data
    currentSettings.settings[this.selectedErp] = {
      ...currentSettings.settings[this.selectedErp],
      ...this.form.value
    };

    this.erpSettingsService.updateErpSettings(currentSettings).subscribe({
      next: (response: any) => {
        this.hotToastService.success('ERP settings saved successfully!');
        this.allErpSettings = response.result; // Update local cache with response
        // Update enabled status in erpList after saving
        this.erpList = this.erpList.map(erp => ({
          ...erp,
          enabled: !!response.result.settings?.[erp.id]?.enabled
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
