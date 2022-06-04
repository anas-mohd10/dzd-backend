import { Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CollectionService } from 'src/app/includes/services/collection.service';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
})
export class CollectionListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  appRoute = appRoutes;
  collectionData: any

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.getCollection();
  }
  
  getCollection() {
    this.collectionService.getCollection().subscribe((res:any)=>{
      switch(res?.errorCode){
        case 0:
          this.collectionData = res?.result
          break
      }
      this.dtTrigger.next();
    })
  }
}
