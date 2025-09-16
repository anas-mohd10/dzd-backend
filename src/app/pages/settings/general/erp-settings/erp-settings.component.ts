import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * Interface for defining ERP setting fields
 * This allows for dynamic form generation based on ERP type
 */
interface ErpSettingField {
  key: string; // e.g., 'url', 'db', 'token'
  label: string; // e.g., 'URL', 'Database Name', 'Token'
  type: 'text' | 'password' | 'number'; // Input field type
  placeholder?: string;
}

/**
 * Interface for ERP settings structure
 * Supports multiple ERP systems with dynamic field configuration
 */
interface ErpSettings {
  [erpType: string]: { // e.g., 'odoo', 'zoho', 'sap'
    name: string;
    enabled: boolean;
    fields: ErpSettingField[];
    [key: string]: any; // Other properties for internal use
  };
}

/**
 * Interface for API response structure
 */
interface ErpSettingsResponse {
  errorCode: number;
  message: string;
  result?: {
    settings: any;
    [key: string]: any;
  };
}

@Component({
  selector: 'app-erp-settings',
  templateUrl: './erp-settings.component.html',
  styleUrls: ['./erp-settings.component.scss'],
})
export class ErpSettingsComponent implements OnInit {
  appRoute = appRoutes;

  // Loading and state management
  isLoading: boolean = false;
  isSubmitted: boolean = false;

  // Modal management
  modalRef?: BsModalRef;
  activeErpType: string = '';
  activeErpDetails: any = null;

  // Form management
  form: FormGroup = new FormGroup({});

  // ERP configuration with dynamic fields
  erpSettings: ErpSettings = {
    odoo: {
      name: 'Odoo',
      enabled: false,
      fields: [
        { key: 'url', label: 'Server URL', type: 'text', placeholder: 'https://your-odoo-server.com' },
        { key: 'db', label: 'Database Name', type: 'text', placeholder: 'your_database_name' },
        { key: 'username', label: 'Username', type: 'text', placeholder: 'admin' },
        { key: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' }
      ]
    },
    zoho: {
      name: 'Zoho',
      enabled: false,
      fields: [
        { key: 'url', label: 'API URL', type: 'text', placeholder: 'https://www.zohoapis.com' },
        { key: 'token', label: 'Access Token', type: 'password', placeholder: 'Enter access token' }
      ]
    },
    sap: {
      name: 'SAP',
      enabled: false,
      fields: [
        { key: 'url', label: 'SAP URL', type: 'text', placeholder: 'https://your-sap-server.com' },
        { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Enter client ID' }
      ]
    }
  };

  // API endpoints
  private readonly API_BASE = `${environment.apiUrl}`;

  get formControls() {
    return this.form.controls;
  }

  constructor(
    private httpClient: HttpClient,
    private hotToastService: HotToastService,
    private changeDetectorRef: ChangeDetectorRef,
    private bsModalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchErpSettings();
  }

  /**
   * Initialize the reactive form with dynamic controls
   */
  private initializeForm(): void {
    const formControls: { [key: string]: FormControl } = {};

    // Add controls for each ERP system and their fields
    Object.keys(this.erpSettings).forEach(erpType => {
      const erpConfig = this.erpSettings[erpType];

      // Add enabled control for each ERP
      formControls[`${erpType}_enabled`] = new FormControl(erpConfig.enabled);

      // Add controls for each field
      erpConfig.fields.forEach(field => {
        formControls[`${erpType}_${field.key}`] = new FormControl('');
      });
    });

    this.form = new FormGroup(formControls);
  }

  /**
   * Fetch ERP settings from the backend
   */
  fetchErpSettings(): void {
    this.isLoading = true;

    this.httpClient.get<ErpSettingsResponse>(`${this.API_BASE}/erp-settings`)
      .subscribe({
        next: (response) => {
          if (response.errorCode === 0 && response.result) {
            this.updateErpSettingsFromResponse(response.result.settings);
            this.changeDetectorRef.markForCheck();
          } else {
            this.hotToastService.error(response.message || 'Failed to fetch ERP settings');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching ERP settings:', error);
          this.hotToastService.error('Failed to fetch ERP settings');
          this.isLoading = false;
        }
      });
  }

  /**
   * Update local ERP settings from API response
   */
  private updateErpSettingsFromResponse(settings: any): void {
    Object.keys(this.erpSettings).forEach(erpType => {
      if (settings[erpType]) {
        // Update enabled status
        this.erpSettings[erpType].enabled = settings[erpType].enabled || false;
        this.form.patchValue({ [`${erpType}_enabled`]: this.erpSettings[erpType].enabled });

        // Update field values
        this.erpSettings[erpType].fields.forEach(field => {
          const value = settings[erpType][field.key] || '';
          this.form.patchValue({ [`${erpType}_${field.key}`]: value });
        });
      }
    });
  }

  /**
   * Handle ERP toggle switch changes
   */
  onErpToggleChanged(event: { switchId: string; toggleState: boolean }, erpType: string): void {
    this.erpSettings[erpType].enabled = event.toggleState;
    this.form.patchValue({ [`${erpType}_enabled`]: event.toggleState });

    // Save the toggle state immediately
    this.saveErpSettings(erpType, { enabled: event.toggleState });
  }

  /**
   * Open modal for ERP configuration
   */
  openErpModal(template: TemplateRef<any>, erpType: string): void {
    this.activeErpType = erpType;
    this.activeErpDetails = this.erpSettings[erpType];

    // Set validators for the active ERP fields
    this.setValidatorsForErp(erpType);

    this.modalRef = this.bsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    });
  }

  /**
   * Set validators for specific ERP fields
   */
  private setValidatorsForErp(erpType: string): void {
    const erpConfig = this.erpSettings[erpType];

    // Clear all validators first
    Object.keys(this.form.controls).forEach(controlName => {
      this.form.get(controlName)?.clearValidators();
      this.form.get(controlName)?.updateValueAndValidity();
    });

    // Set validators for current ERP fields
    erpConfig.fields.forEach(field => {
      const controlName = `${erpType}_${field.key}`;
      const control = this.form.get(controlName);
      if (control) {
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      }
    });
  }

  /**
   * Close modal and reset form state
   */
  closeModal(): void {
    this.modalRef?.hide();
    this.activeErpType = '';
    this.activeErpDetails = null;
    this.isSubmitted = false;

    // Clear validators
    Object.keys(this.form.controls).forEach(controlName => {
      this.form.get(controlName)?.clearValidators();
      this.form.get(controlName)?.updateValueAndValidity();
    });
  }

  /**
   * Save ERP settings for a specific ERP type
   */
  onSubmit(): void {
    if (!this.activeErpType) return;

    // Validate form for current ERP
    const erpConfig = this.erpSettings[this.activeErpType];
    let isValid = true;

    erpConfig.fields.forEach(field => {
      const controlName = `${this.activeErpType}_${field.key}`;
      const control = this.form.get(controlName);
      if (control && control.invalid) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.isSubmitted = true;
      return;
    }

    // Prepare settings object for the current ERP
    const erpSettings: any = {
      enabled: this.erpSettings[this.activeErpType].enabled
    };

    erpConfig.fields.forEach(field => {
      const controlName = `${this.activeErpType}_${field.key}`;
      erpSettings[field.key] = this.form.get(controlName)?.value || '';
    });

    this.saveErpSettings(this.activeErpType, erpSettings);
  }

  /**
   * Save ERP settings to backend
   */
  private saveErpSettings(erpType: string, settings: any): void {
    const payload = {
      settings: {
        [erpType]: {
          ...this.erpSettings[erpType],
          ...settings
        }
      }
    };

    this.httpClient.put<ErpSettingsResponse>(`${this.API_BASE}/erp-settings`, payload)
      .subscribe({
        next: (response) => {
          if (response.errorCode === 0) {
            this.hotToastService.success('ERP settings updated successfully');

            // Update local settings
            Object.assign(this.erpSettings[erpType], settings);

            // Close modal if it was a form submission
            if (this.activeErpType === erpType && this.modalRef) {
              this.closeModal();
            }

            this.changeDetectorRef.markForCheck();
          } else {
            this.hotToastService.error(response.message || 'Failed to update ERP settings');
          }
        },
        error: (error) => {
          console.error('Error updating ERP settings:', error);
          this.hotToastService.error('Failed to update ERP settings');
        }
      });
  }

  /**
   * Get ERP types as array for template iteration
   */
  getErpTypes(): string[] {
    return Object.keys(this.erpSettings);
  }

  /**
   * Check if an ERP system is enabled
   */
  isErpEnabled(erpType: string): boolean {
    return this.erpSettings[erpType]?.enabled || false;
  }

  /**
   * Get form control value for a specific ERP field
   */
  getFieldValue(erpType: string, fieldKey: string): string {
    return this.form.get(`${erpType}_${fieldKey}`)?.value || '';
  }

  /**
   * Check if a field has validation errors
   */
  hasFieldError(erpType: string, fieldKey: string): boolean {
    const control = this.form.get(`${erpType}_${fieldKey}`);
    return !!(control && control.invalid && (control.touched || this.isSubmitted));
  }
}
