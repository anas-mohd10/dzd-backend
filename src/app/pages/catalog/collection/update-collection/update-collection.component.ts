import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-collection',
  templateUrl: './update-collection.component.html',
  styleUrls: ['./update-collection.component.scss'],
})
export class UpdateCollectionComponent implements OnInit {
  collectionForm: FormGroup;
  task = PageTasks.UPDATE;

  editMode = false;
  fileData: any;
  appRoute = appRoutes
  collectionData: any;
  collection: any;

  constructor(
    private collectionService: CollectionService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.collection = this.route.snapshot.queryParams.collection || '';
    this.getCollection();
    this.managePage()
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

  getCollection() {
    console.log(this.collection)
    this.collectionService.getCollectionBySlug(this.collection).subscribe((res:any)=>{
      switch(res?.errorCode){
        case 0:
          this.collectionData = res?.result
          break
      }
    })
  }

  onSubmit(){}
}
