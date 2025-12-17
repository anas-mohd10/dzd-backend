import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { ProjectService } from 'src/app/includes/services/project.service';
import { environment } from 'src/environments/environment';

interface ProjectCategory {
  _id: string
  title: string
  thumbnail: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  slug: string
}

@Component({
  selector: 'app-project-categories',
  templateUrl: './project-categories.component.html',
  styleUrls: ['./project-categories.component.scss']
})
export class ProjectCategoriesComponent implements OnInit {
  modalRef?: BsModalRef
  deleteRef?: BsModalRef
  isEditMode: boolean = false
  appRoute = appRoutes
  form: FormGroup = new FormGroup({})
  isSubmitted: boolean = false
  base: string = environment.base
  selectedCategory?: ProjectCategory
  categories: ProjectCategory[] = []

  constructor(
    private ProjectService: ProjectService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  delete(template: TemplateRef<any>, category: ProjectCategory) {
    this.deleteRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
    this.selectedCategory = category
  }

  confirm() {
    this.deleteCategory(this.selectedCategory?._id)
  }

  decline() {
    this.deleteRef?.hide()
    this.selectedCategory = undefined
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      thumbnail: new FormControl(''),
      isActive: new FormControl(true),
      isDelete: new FormControl(false),
    })

    this.fetchCategories()
  }

  toggleStatus(event: { switchId: string, toggleState: boolean }) {
    this.ProjectService.updateCategory(event.switchId, { isActive: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.fetchCategories()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (error: any) => {
        this.HotToastService.error(error.message)
      }
    })
  }

  deleteCategory(categoryId: string | undefined) {
    if (!categoryId) {
      this.HotToastService.error('Category ID is required')
      return
    }

    this.ProjectService.deleteCategory(categoryId).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.fetchCategories()
          this.deleteRef?.hide()
          this.selectedCategory = undefined
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (error: any) => {
        this.HotToastService.error(error.message)
      }
    })
  }
  handleThumbnail(event: { path: string, _id: string }) {
    this.form.patchValue({ thumbnail: event.path })
  }

  formatDate(date: string) {
    return `${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} 
    ${new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
  }

  close() {
    this.modalRef?.hide()
    this.form.patchValue({ title: '', thumbnail: '', isActive: true, isDelete: false })
  }

  fetchCategories() {
    this.ProjectService.getCategories().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.categories = res.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (error: any) => {
        this.HotToastService.error(error.message)
      }
    })
  }

  fetchCategory(categoryId: string) {
    this.ProjectService.getCategoryDetails(categoryId).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.form.patchValue(res.result)
          this.selectedCategory = res.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (error: any) => {
        this.HotToastService.error(error.message)
      }
    })
  }

  saveChanges() {
    if (!this.form.valid) {
      this.isSubmitted = true
      this.HotToastService.error('Please fill all the required fields')
      return
    }

    if (this.isEditMode) {
      this.updateCategory()
    } else {
      this.createCategory()
    }
  }

  updateCategory() {
    this.ProjectService.updateCategory(this.selectedCategory?._id, this.form.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.onSuccess()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  onSuccess() {
    this.modalRef?.hide()
    this.selectedCategory = undefined
    this.isEditMode = false
    this.form.patchValue({ title: '', thumbnail: '', isActive: true, isDelete: false })
    this.fetchCategories()
  }

  createCategory() {
    this.ProjectService.createCategory(this.form.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.onSuccess()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

}
