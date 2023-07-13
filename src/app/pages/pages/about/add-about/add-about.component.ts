import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AboutService } from 'src/app/includes/services/about.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-add-about',
  templateUrl: './add-about.component.html',
  styleUrls: ['./add-about.component.scss']
})
export class AddAboutComponent implements OnInit {
  appRoute = appRoutes
  aboutData: any;
  displayTable: boolean;
  form: FormGroup
  task = PageTasks.ADD;
  editMode = false;
  isSubmitted: boolean;
  isData: Boolean = false
  isHidden: Boolean = true
  slug: any;

  addedFeatures: Array<any> = []
  file: File
  isFile: boolean = false
  previewFile: string = ''

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter about here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'manrope', name: 'Manrope' }
    ]
  };

  title: FormControl = new FormControl('')
  note: FormControl = new FormControl('')
  previewIcon: string = ''
  iconName: string = ''

  constructor(
    private AboutService: AboutService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getAbout()
  }

  initForm() {
    this.form = new FormGroup({
      overview: new FormControl('', Validators.required),
      detailed: new FormControl(''),
    });
  }

  get af() {
    return this.form.controls;
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  getAbout() {
    this.AboutService.getAboutDetails().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.isData = res?.result ? true : false
        this.addedFeatures = res?.result?.features
        for (let feature of res?.result?.features) feature.icon = environment.base + "/" + feature.icon
        this.previewFile = environment.base + "/" + res?.result?.image
        res?.result?.image ? this.isFile = true : this.isFile = false
        for (let _key of Object.keys(res?.result?.description)) this.form.get(_key)?.setValue(res?.result?.description[_key])
      }
    })
  }

  reloadPage() {
    this.isSubmitted = false
    this.isHidden = true
    this.ngOnInit()
  }

  showButton() {
    this.isHidden = false
  }

  onInputChange(event: any, type: any) {
    switch (type) {
      case 'hero':
        this.file = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => { this.previewFile = reader.result as string }
        reader.readAsDataURL(this.file);
        this.isFile = true
        break
      case 'icon':
        let icon = event.target.files[0]
        this.iconName = icon.name
        let iconReader = new FileReader();
        iconReader.onloadend = () => { this.previewIcon = iconReader.result as string };
        iconReader.readAsDataURL(icon);
        break
    }
  }

  addFeature() {
    this.addedFeatures.push({
      title: this.title.value,
      name: this.iconName,
      note: this.note.value,
      icon: this.previewIcon
    })

    this.discardFeature()
  }

  discardFeature() {
    this.title.setValue('')
    this.note.setValue('')
    this.previewIcon = ''
    this.iconName = ''
  }

  deleteFeature(id: any) {
    this.addedFeatures.splice(id, 1)
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }
    let formdata = new FormData()
    formdata.append("file", this.file)
    for (let _key of Object.keys(this.form.value)) formdata.append(_key, this.form.value[_key])
    formdata.append("features", JSON.stringify(this.addedFeatures))
    if (!this.isData) {
      this.AboutService.manageAbout(formdata).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    } else {
      this.AboutService.manageAbout(formdata).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    }
  }

  afterResult(errorcode: any, message: any) {
    if (errorcode != 0) {
      this.toastr.error(message);
    } else if (errorcode == 0) {
      this.toastr.success(message);
      this.isHidden = true
      this.ngOnInit()
    }
  }

}
