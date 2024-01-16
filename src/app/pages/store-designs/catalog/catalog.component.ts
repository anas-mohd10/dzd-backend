import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  catalogPage: FormControl = new FormControl("");
  catalogPages: Array<any> = [];
  catalogPageDetails: any = {};
  catalogTitle: FormControl = new FormControl("");
  metaForm: FormGroup;
  catalogForm: FormGroup;
  createRef?: BsModalRef
  isCopy: FormControl = new FormControl(false);

  constructor(
    private BsModalService: BsModalService
  ) { }

  openCreate(template: TemplateRef<any>): void {
    this.createRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  closeCreate(): void {
    this.createRef?.hide()
    this.catalogForm.reset()
  }

  ngOnInit(): void {
    this.metaForm = new FormGroup({
      metaTitle: new FormControl(""),
      metaDescription: new FormControl(""),
      metaKeywords: new FormControl(""),
    })

    this.catalogForm = new FormGroup({
      title: new FormControl("", Validators.required),
      description: new FormControl(""),
      isCopy: new FormControl(false),
      catalogReference: new FormControl(""),
    })
  }

}
