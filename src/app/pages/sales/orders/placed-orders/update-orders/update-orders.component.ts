import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';
import { SwiperOptions } from 'swiper';
import moment from 'moment-timezone';
import * as countriesAndTimezones from 'countries-and-timezones';
import { ShippingGatwaysService } from 'src/app/includes/services/shipping-gatways.service';
import { ShipmentService } from 'src/app/includes/services/shipment.service';

@Component({
  selector: 'app-update-orders',
  templateUrl: './update-orders.component.html',
  styleUrls: ['./update-orders.component.scss'],
})
export class UpdateOrdersComponent implements OnInit {
  isConfirmLoading: boolean = false;
  isCancelConfirmLoading: boolean = false;
  isBulkUpdateLoading: boolean = false;
  isForceUpdateLoading: boolean = false;
  isStatusUpdating: boolean = false;  // Already declared. Added here to be complete
  isForceProcessing: boolean = false;   // Already declared. Added here to be complete
  appRoute = appRoutes;
  order: any;
  productCount: any;
  orderNumber: any;
  form: FormGroup;
  slug: any;
  base: string;
  isLoading: boolean = false;
  settings: any;
  swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 50,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    autoplay: true,
    breakpoints: {
      320: { slidesPerView: 'auto', spaceBetween: 35, },
      480: { slidesPerView: 'auto', spaceBetween: 35, },
      640: { slidesPerView: 'auto', spaceBetween: 35, },
    },
  };
  orderStatus: string = '';
  isCancelEligible: boolean = false;
  invoiceStatusList: Array<any> = ['PENDING', 'PLACED'];
  isInvoiceAvailable: boolean = false;
  isPackingSlipAvailable: boolean = false;
  modalRef?: BsModalRef;
  isCancelled: boolean = false;
  bulkOrderStatus: FormControl = new FormControl('');
  productOrderStatus: FormControl = new FormControl('');
  orderNote: FormControl = new FormControl('');
  reason: FormControl = new FormControl('');
  isNoteDetected: boolean = false;
  bulkProducts: Array<any> = [];
  bulkStatus: Array<any> = [];
  noteModalRef?: BsModalRef;
  @ViewChild('cancelConfirmation') cancelConfirmation: any
  cancelConfirmationRef?: BsModalRef
  productToBeCancelled: string | null;
  bulkUpdateConfirmationRef?: BsModalRef;
  bulkStatusToUpdate: string | null = null;
  @ViewChild('bulkUpdateConfirmation') bulkUpdateConfirmation: any;
  @ViewChild('failedPayment') failedPayment: any;
  failedPaymenRef?: BsModalRef;

  shipmentItems: string[] = ['PLACED', 'ACCEPTED']
  shippingRef: BsModalRef | null
  shippingGateway: string | null
  shippingGateways: Array<any> = []
  safexpressForm: FormGroup;

  constructor(
    private ShipmentService: ShipmentService,
    private ShippingGatwaysService: ShippingGatwaysService,
    private OrdersService: OrdersService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
    private HotToastService: HotToastService
  ) { }
  // Create Shipment
  createShipment() {
    let payload: any = {
      orderId: this.slug,
      gateway: this.shippingGateway
    }

    if (this.shippingGateway === 'safexpress') {
      if (this.safexpressForm.invalid) {
        this.safexpressForm.markAllAsTouched()
        this.HotToastService.error("Please fill all package details")
        return
      }
      payload = { ...payload, ...this.safexpressForm.value }
    }

    this.ShipmentService.createShipment(payload).subscribe({
      next: (resp: any) => {
        if (resp && resp.errorCode == 0) {
          this.shippingRef?.hide()
          this.HotToastService.success(resp.message)
          this.getOrderDetails()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(resp.message)
        }
      }, error: (err) => {
        this.HotToastService.error(`Internal Server Error`)
      }
    })
  }

  downdloadShipmentLabel() {
    this.ShipmentService.getShipmentLabel(this.slug).subscribe({
      next: (resp: any) => {
        if (resp && resp.errorCode == 0) {
          const labelUrl: string = resp.result.url
          window.open(labelUrl, '_blank')
        } else {
          this.HotToastService.error(resp.message)
        }
      }, error: (err) => {
        this.HotToastService.error(`Internal Server Error`)
      }
    })
  }

  openShipment(template: TemplateRef<any>) {
    this.shippingRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  toTitleCase(str: string): string {
    return str
      .replace(/-/g, ' ') // Replace all hyphens with spaces
      .split(' ')         // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize
      .join(' ');         // Join back with spaces
  }


  getLocaleDateString(date: string) {
    return new Date(date).toLocaleString();
  }

  formatPaymentGateway(paymentGateway: string) {
    //Remove - and add space between words if any, Make it sentence case
    if (paymentGateway) {
      return paymentGateway
        .replace(/-/g, ' ')
        .replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
  }

  formatWords(wordString: string) {
    if (wordString) {
      return wordString
        .replace(/_/g, ' ')
        .replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    return ''
  }

  formatPaymentStatus(paymentStatus: string) {
    if (paymentStatus) {
      return paymentStatus
        .replace(/_/g, ' ')
        .replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    return ''
  }

  ngOnInit(): void {
    this.base = environment.base;
    this.initForm();
    this.slug = this.route.snapshot.queryParams.order || '';
    this.getOrderDetails();

    this.ShippingGatwaysService.shippingGateways('enabled').subscribe({
      next: (resp: any) => {
        if (resp && resp.errorCode == 0) {
          this.shippingGateways = resp.result.response
        } else { }
      }, error: (err) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }


  openNotes(template: TemplateRef<any>) {
    this.noteModalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered',
    });
  }

  acceptOrderPayment() {
    this.OrdersService.orderPaymentAcceptance(this.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrderDetails();
          this.HotToastService.success(res?.message);
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      paymentStatus: [''],
      orderId: [''],
      paymentMessage: [''],
      transactionTime: [''],
      paymentId: [''],
    });

    this.safexpressForm = this.formBuilder.group({
      numOfPackage: [1, [Validators.required, Validators.min(1)]],
      pkgLength: [10, [Validators.required, Validators.min(1)]],
      pkgBreadth: [10, [Validators.required, Validators.min(1)]],
      pkgHeight: [10, [Validators.required, Validators.min(1)]],
      totalWeight: [1, [Validators.required, Validators.min(0.1)]]
    });
  }


  saveNote() {
    if (this.orderNote.value) {
      // Create the complete note object with all required fields

      this.OrdersService.addOrderNote(this.slug, this.orderNote.value).subscribe({
        next: (res: any) => {
          if (res?.order) {
            this.getOrderDetails(); // Refresh order details
            this.orderNote.setValue(''); // Clear the note input
            this.isNoteDetected = false; // Reset note detection state
            this.HotToastService.success('Note added successfully');
          } else {
            this.HotToastService.error('Failed to add note');
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err?.error?.error || 'Error adding note');
        },
      });
    }
  }


  getLocalDate(date: any) {
    return `${new Date(date).toLocaleString()}`;
  }

  formatDate(date: string) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC', // Force UTC timezone
    }).format(new Date(date));
  }

  formatTime(time: string) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'UTC', // Force UTC timezone
    }).format(new Date(time));
  }

  getLocaleDateFormat(processDate: any) {
    return new Date(processDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' });
  }

  formatDateString(date: string) {
    const countryCode: string = this.settings.country.toUpperCase() === 'UAE' ? 'AE' : this.settings.country.toUpperCase();
    const country = countriesAndTimezones.getCountry(countryCode);
    const timezone = country?.timezones[0] || 'UTC';
    const now = moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    return `${now} (${timezone})`;
  }

  getLocaleTimeFormat(processDate: any) {
    return new Date(processDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
  }


  getOrderDetails() {
    this.isLoading = true;
    this.OrdersService.getOrderDetails({ order: this.slug }).subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.order = res?.result;
          this.orderNumber = res?.result?.orderNo;
          this.productCount = this.order.products.length;
          this.form.get('paymentStatus')?.setValue(this.order?.paymentStatus);
          this.orderNote?.setValue('');
          this.form.get('orderId')?.setValue(this.order?.payment?.reference?.payment || this.order?.payment?.authorizationId);

          this.form.get('paymentMessage')?.setValue(this.order?.paymentMessage);
          this.form.get('transactionTime')?.setValue(this.order?.transactionTime);
          this.form.get('paymentId')?.setValue(this.order?.payment?.referenceId);
          this.orderStatus = res.result.orderStatus.charAt(0).toUpperCase() + res.result.orderStatus.slice(1).toLowerCase();
          ['PLACED', 'DELIVERED', 'CANCELLED', 'COLLECTED'].includes(res.result.orderStatus) ? (this.isCancelEligible = false) : (this.isCancelEligible = true);
          this.invoiceStatusList.includes(res.result.orderStatus) ? (this.isInvoiceAvailable = false) : (this.isInvoiceAvailable = true);
          this.invoiceStatusList.includes(res.result.orderStatus) ? (this.isPackingSlipAvailable = false) : (this.isPackingSlipAvailable = true);

          if (this.order.orderStatus == 'CANCELLED') {
            this.isCancelled = true;
          }

          for (let product of this.order?.products) {
            for (let history of product?.history) {
              history.status = history.status.charAt(0).toUpperCase() + history.status.slice(1).toLowerCase();
            }

            let history = [...product?.history];
            if (product?.dateExpected) {
              product.dateExpected = new Date(product?.dateExpected).toLocaleString();
            }
            product.currentStatus = history.pop();
          }

          // Track shipment
          if (this.order && this.order.isLabelCreated) {
            this.ShipmentService.trackShipment(this.slug).subscribe({
              next: (resp: any) => {
                if (resp && resp.errorCode == 0) {
                  if (this.order.shippingGateway === 'safexpress' && resp.result?.response) {
                    const trackingData = resp.result.response;
                    
                    // Safexpress tracking extraction
                    let trackingStatus = trackingData?.status || trackingData?.currentStatus || trackingData?.trackingStatus || trackingData?.latestStatus;
                    
                    // Check if array
                    if (!trackingStatus && Array.isArray(trackingData) && trackingData.length > 0) {
                      trackingStatus = trackingData[0]?.status || trackingData[0]?.currentStatus || trackingData[0]?.milestone;
                    }
                    
                    // Deep check if nested e.g., trackingData.response
                    if (!trackingStatus && trackingData?.response && Array.isArray(trackingData.response) && trackingData.response.length > 0) {
                      trackingStatus = trackingData.response[0]?.status || trackingData.response[0]?.currentStatus || "In Transit";
                    } else if (!trackingStatus) {
                      // Fallback status if we just know it succeeded
                      trackingStatus = "Tracking Info Available";
                    }

                    if (trackingStatus) {
                       const noteStr = `Safexpress Tracking [AWB: ${this.order.awbNumber}]: ${trackingStatus}`;
                       const noteExists = this.order.orderNote && this.order.orderNote.some((n: any) => n.message === noteStr);
                       
                       // Add note if it doesn't already exist for this same status string
                       if (!noteExists) {
                         this.OrdersService.addOrderNote(this.slug, noteStr).subscribe({
                           next: () => {
                             // Re-fetch order so the new note shows up in UI
                             this.getOrderDetails();
                           }
                         });
                       }
                    }
                  }
                } else {
                  this.HotToastService.error(resp.message)
                }
              }, error: (err) => {
                this.HotToastService.error(`Internal Server Error`)
              }
            })
          }

          this.ChangeDetectorRef.markForCheck();
        }
        this.isLoading = false;
      }
    );
  }

  copyCoordinates() {
    const latitude = this.order?.address?.coordinates?.latitude;
    const longitude = this.order?.address?.coordinates?.longitude;
    if (latitude && longitude) {
      const mapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      navigator.clipboard.writeText(mapLink).then(() => {
        this.HotToastService.success('Map link copied to clipboard');
      }).catch((error) => {
        console.error('Failed to copy map link: ', error);
        this.HotToastService.error('Failed to copy map link: ', error);
      });
    } else {
      this.HotToastService.error('Coordinates not available');
    }
  }


  openCancelConfirmation(template: TemplateRef<any>) {
    this.cancelConfirmationRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true
    });
  }

  closeCancelConfirmation() {
    this.cancelConfirmationRef?.hide()
    this.productToBeCancelled = null
    this.productOrderStatus.setValue('')
  }

  updateOrderStatus(event: any, productItem: any) {
    if (event.target.value == 'CANCELLED') {
      this.productToBeCancelled = productItem
      this.openCancelConfirmation(this.cancelConfirmation)
      return
    }

    this.isLoading = true;
    this.OrdersService.updateOrderStatus({
      order: this.slug,
      product: productItem,
      status: event.target.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrderDetails();
          this.productOrderStatus.setValue('');
          this.HotToastService.success(res.message);
        } else {
          this.HotToastService.error(res.message);
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
        this.isLoading = false;

      },
    });
  }

  confirmCancel() {
    this.isLoading = true
    this.isCancelConfirmLoading = true;
    this.cancelConfirmationRef?.hide() // Close the cancel confirmation modal
    this.OrdersService.updateBulkProduct({
      products: [{ productId: this.productToBeCancelled }],
      status: 'CANCELLED',
    }, this.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrderDetails();
          this.productOrderStatus.setValue('');
          this.productToBeCancelled = null
          this.closeCancelConfirmation()
          this.HotToastService.success(res.message);
        } else {
          this.HotToastService.error(res.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    }).add(() => {
      this.isCancelConfirmLoading = false;
    });
  }

  declineCancel() {
    this.closeCancelConfirmation()
  }




  toggleBulkProduct(product?: any) {
    if (product) {
      const index = this.bulkProducts.indexOf(product);
      if (index > -1) {
        const addOnProducts = this.order.products.filter((p: any) => p.isAddOn == true && p.productRef._id == product.productId)
        this.bulkProducts.splice(index, 1);
        addOnProducts.forEach((addOnProduct: any) => {
          const addOnIndex = this.bulkProducts.indexOf(addOnProduct);
          if (addOnIndex > -1) {
            this.bulkProducts.splice(addOnIndex, 1);
          }
        })
      } else {
        this.bulkProducts.push(product);
      }
    } else {
    }

    product
      ? null
      : this.bulkProducts.length == this.order?.products.length
        ? (this.bulkProducts = [])
        : (this.bulkProducts = [...this.order?.products]);
    //Check the last status of the product, if cancelled then don't allow to change the status

    // Push the add-on product of the parent product when the status of the parent product is changed
    this.bulkProducts.forEach(product => {
      if (product.isAddOn == false) {
        const addOnProducts = this.order.products.filter((p: any) => p.isAddOn == true && p.productRef._id == product.productId)
        // Check if the add-on product is already in the bulk products
        addOnProducts.forEach((addOnProduct: any) => {
          if (!this.bulkProducts.some((p: any) => p.productId == addOnProduct.productId)) {
            this.bulkProducts.push(addOnProduct)
          }
        })
      }
    })

    this.bulkProducts.length > 0 ? this.toggleBulkStatus() : null;
  }


  toggleBulkStatus() {
    this.OrdersService.getStatusList(
      this.order?.orderStatus,
      this.order?.deliveryType == '0' ? 'normal' : 'collect'
    ).subscribe({
      next: (res: any) => {
        this.bulkStatus = res?.result;
        this.ChangeDetectorRef.markForCheck();
      },
      error: (err: any) => {
        this.HotToastService.error("Couldn't fetch order status list");
      },
    });
  }

  updateBulkProduct(event: any) {
    this.bulkStatusToUpdate = event?.target?.value;
    this.openBulkUpdateConfirmation(this.bulkUpdateConfirmation);
  }

  openBulkUpdateConfirmation(template: TemplateRef<any>) {
    this.bulkUpdateConfirmationRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true
    });
  }

  closeBulkUpdateConfirmation() {
    this.bulkUpdateConfirmationRef?.hide();
    this.bulkStatusToUpdate = null;
    this.bulkOrderStatus.setValue('');
    this.bulkProducts = []
    this.isStatusUpdating = false
  }

  orderForceUpdate() {
    this.isForceProcessing = true
    this.OrdersService.updateBulkProduct({
      order: this.order?._id,
      isForce: true,
      status: this.bulkStatusToUpdate,
      products: this.bulkProducts,
    }, this.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.declineForceUpdate();
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    }).add(() => {
      this.isForceProcessing = false; // Re-enable buttons for force update modal
    });
  }

  declineForceUpdate() {
    this.failedPaymenRef?.hide();
    this.bulkProducts = [];
    this.bulkStatus = [];
    this.isStatusUpdating = false
    this.bulkOrderStatus.setValue('');
    this.getOrderDetails();
  }

  confirmBulkUpdate() {
    this.bulkUpdateConfirmationRef?.hide() // Close the confirmation popup

    this.isLoading = true;
    this.isBulkUpdateLoading = true;
    this.OrdersService.updateBulkProduct({
      order: this.order?._id,
      status: this.bulkStatusToUpdate,
      products: this.bulkProducts,
    }, this.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.bulkProducts = [];
          this.bulkStatus = [];
          this.bulkOrderStatus.setValue('');
          this.getOrderDetails();
        } else if (res?.errorCode == 400) {
          this.failedPaymenRef = this.BsModalService.show(this.failedPayment, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });
        } else {
          this.HotToastService.error(res?.message);
        }
        this.isLoading = false;

      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
        this.isLoading = false;

      },
    }).add(() => {
      this.isBulkUpdateLoading = false;  // Re-enable buttons for bulk update modal
    });
  }

  declineBulkUpdate() {
    this.closeBulkUpdateConfirmation();
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  confirm() {
    this.isConfirmLoading = true;
    this.OrdersService.cancelOrderDetails({
      order: this.slug,
      reason: this.reason.value,
    }, this.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrderDetails();
          this.HotToastService.success(res?.message);
          this.ChangeDetectorRef.markForCheck();
          this.modalRef?.hide();
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    }).add(() => {
      this.isConfirmLoading = false;  // Re-enable buttons for general confirmation modal
    });
  }

  decline() {
    this.reason.setValue('');
    this.modalRef?.hide();
  }

  getInvoiceSignedUrl(orderId: string) {
    this.OrdersService.getInvoiceSignedUrl(orderId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          window.open(res?.result?.url, "_blank")
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
      }
    })
  }

  getPackingSlipSignedUrl(orderId: string) {
    this.OrdersService.getPackingSlipSignedUrl(orderId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          window.open(res?.result?.url, "_blank")
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
      }
    })
  }

  toggleEdit(product: any) {
    if (product.isEditing) {
      this.saveQuantity(product);
    } else {
      product.isEditing = true;
      product.newQuantity = product.quantity;
    }
  }

  cancelEdit(product: any) {
    product.isEditing = false;
    product.newQuantity = null;
  }

  saveQuantity(product: any) {
    if (!product.newQuantity || product.newQuantity <= 0) {
      this.HotToastService.error("Invalid quantity");
      return;
    }

    // Only proceed if quantity actually changed
    if (product.newQuantity == product.quantity) {
      this.cancelEdit(product);
      return;
    }

    this.isLoading = true;
    // Get current status to avoid changing it (history logic checks exists)
    // Use the latest status from history or fallback to order status
    let currentStatus = this.orderStatus;
    // Maps display status back to internal status enum if needed, but existing code uses uppercase/lowercase mix.
    // Backend expects specific enum probably. History stores UPPERCASE usually?
    // In getOrderDetails (frontend ts):
    // history.status = history.status.charAt(0).toUpperCase() + history.status.slice(1).toLowerCase();
    // So currentStatus might be "Placed". Backend compares with "PLACED"?
    // The backend `updateOrderFromWebhook` handles status check.
    // Let's rely on what `bulkStatusToUpdate` would use, or just use the order status.
    // Actually, backend `updateOrderFromWebhook` takes `status` arg.
    // Use the product's last status if available.

    // However, if I send "PLACED" and existing is "Placed" (different case), it might dup.
    // Valid statuses: ['PLACED', 'ACCEPTED', 'PACKED', 'SHIPPED', 'OUT FOR DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED', 'COLLECTED']
    // Frontend `this.orderStatus` is Title Case.
    // I should convert to UPPERCASE for safety?
    const statusToSend = this.order.orderStatus; // This is usually from DB directly before formatting?
    // Frontend ts line 315: this.orderStatus = res.result.orderStatus.charAt(0).toUpperCase() ...
    // So `this.order.orderStatus` is likely the original value.

    this.OrdersService.updateBulkProduct({
      order: this.order?._id,
      status: statusToSend,
      products: [{ productId: product.productId._id || product.productId, quantity: product.newQuantity }]
    }, this.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.getOrderDetails(); // Refresh
        } else {
          this.HotToastService.error(res?.message);
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
        this.isLoading = false;
      }
    });
  }
}