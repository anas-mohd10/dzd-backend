import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { ProjectService } from 'src/app/includes/services/project.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { HotToastService } from '@ngneat/hot-toast';

interface Project {
  _id: string;
  title: string;
  thumbnail: string;
  category: { title: string };
  createdAt: string;
  isDraft: boolean;
}

@Component({
  selector: 'app-project-listing',
  templateUrl: './project-listing.component.html',
  styleUrls: ['./project-listing.component.scss'],
})
export class ProjectListingComponent implements OnInit {
  settings: any;
  clear() {
    //clear the form
    this.keyword.setValue('')
    this.date = ''
  }
  appRoute = appRoutes
  keyword: FormControl = new FormControl('');
  date: string
  projects: Project[] = []
  pageIndex: number = 1
  pageSize: number = 20
  isLastPage: boolean = false
  totalResults: number = 0
  totalPages: number = 0
  modalRef: BsModalRef;
  categoryForm: FormGroup;
  categoryThumbnail: any;
  isActive: FormControl = new FormControl('');
  form: FormGroup = new FormGroup({
    projectPromotionalBanner: new FormControl('')
  });

  constructor(
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ProjectService: ProjectService,
    private modalService: BsModalService,
    private AppSettingsService: AppSettingsService,
  ) {
    this.categoryForm = new FormGroup({
      title: new FormControl('', Validators.required),
      thumbnail: new FormControl('', Validators.required)
    });
  }


  ngOnInit(): void {
    this.getProjects();
    this.loadPromoBanner();
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.getProjects()
  }
  openCategoryModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  saveProject(project: any) {
    this.ProjectService.updateProject(project).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.getProjects();
        }
      }
    });
  }

  getProjects() {
    this.ProjectService.projects({
      page: this.pageIndex,
      limit: this.pageSize,
      keyword: this.keyword.value,
      date: this.date,
      status: this.isActive.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.projects = res.result.data;
          this.totalPages = res.result.totalPages;
          this.isLastPage = res.result.isLastPage;
          this.totalResults = res.result.totalResults;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  handleCategoryThumbnail(media: any) {
    this.categoryThumbnail = media.path;
    this.categoryForm.patchValue({ thumbnail: media._id });
  }

  createCategory() {
    if (this.categoryForm.valid) {
      this.ProjectService.createCategory(this.categoryForm.value).subscribe({
        next: (res: any) => {
          if (res?.errorCode === 0) {
            this.modalRef.hide();
          } else { }
        }, error: (err: any) => {
          this.HotToastService.error(`${(err as Error).message}`)
        }
      });
    }
  }

  loadPromoBanner() {
    this.AppSettingsService.getSettings().subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.form.patchValue({ projectPromotionalBanner: res.result.projectPromotionalBanner });
          this.settings = res.result;
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    });
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  close() {
    this.modalRef.hide();
  }

  handleThumbnail(media: any) {
    this.form.patchValue({ projectPromotionalBanner: media.path });
    this.settings.projectPromotionalBanner = media.path;
  }

  removePromoBanner() {
    this.form.get('projectPromotionalBanner')?.setValue('');
    this.settings.projectPromotionalBanner = null;
  }

  savePromo() {
    this.AppSettingsService.updateSettings({
      projectPromotionalBanner: this.form.value.projectPromotionalBanner
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.modalRef.hide();
          this.HotToastService.success(res.message)
          this.ChangeDetectorRef.markForCheck()
          this.loadPromoBanner()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    });
  }

  removeCategoryThumbnail() {
    this.categoryThumbnail = null;
    this.categoryForm.patchValue({ thumbnail: null });
  }
}


