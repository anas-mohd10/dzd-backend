import { ChangeDetectorRef, Component, OnInit, TemplateRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PlatformService } from 'src/app/includes/services/platform.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-redirection-results',
  templateUrl: './redirection-results.component.html',
  styleUrls: ['./redirection-results.component.scss']
})
export class RedirectionResultsComponent implements OnInit {
  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    this.close()
  }

  brands: Array<any> = []
  categories: Array<any> = []
  products: Array<any> = []
  collections: Array<any> = []
  staticPages: Array<any> = []
  modalRef?: BsModalRef;
  keyword: FormControl = new FormControl('', Validators.required)
  redirection: string = ''
  @Input('redirectionResult') redirectionResult?: string
  @Output('setRedirectionResult') setRedirectionResult = new EventEmitter<any>()

  constructor(
    private PlatformService: PlatformService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {
    this.keyword.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.fetchResults()
      })
  }

  ngOnInit(): void {
    this.fetchResults()
  }

  close() {
    this.modalRef?.hide()
    this.keyword.setValue('')
    this.brands = []
    this.categories = []
    this.collections = []
    this.staticPages = []
    this.products = []
  }

  fetchResults() {
    if (!this.keyword.valid) {
      return
    }

    this.PlatformService.getRedirectionResults({ keyword: this.keyword.value }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.brands = res.result.brands
          this.categories = res.result.categories
          this.collections = res.result.collections
          this.products = res.result.products
          this.staticPages = res.result.staticPages
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(
      template,
      {
        class: 'modal-lg',
        ignoreBackdropClick: true
      }
    )
  }

  onResultClick(resultType: string, resultData: any) {
    switch (resultType) {
      case 'brands':
        this.redirection = `/brands/${resultData.slug}`;
        break
      case 'categories':
        this.redirection = `/products/${resultData.slug}`;
        break
      case 'collections':
        this.redirection = `/c/${resultData.slug}`;
        break
      case 'products':
        this.redirection = `/p/${resultData.slug}`;
        break
      case 'staticPages':
        this.redirection = `/pages/${resultData.slug}`;
        break
    }

    this.setRedirectionResult.emit(this.redirection)
    this.redirectionResult = this.redirection
    this.close()
  }

  resultsExists() {
    const arrays = {
      brands: this.brands,
      categories: this.categories,
      products: this.products,
      collections: this.collections,
      staticPages: this.staticPages
    };

    let results = 0

    for (const [key, array] of Object.entries(arrays)) {
      if (array.length > 1) {
        results++
      }
    }

    return results > 0 ? true : false
  }
}
