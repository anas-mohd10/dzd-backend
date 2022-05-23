import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})

export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  constructor(private http: HttpClient) {}

  rootUrl = "http://localhost:3000/api/v1/w/admin/auth";

  ngOnInit(): void {}

  getRoles(){
    this.http.get(this.rootUrl + "/roles").subscribe((_res)=>{
      console.log(_res)
      return _res
    })
  }

  getPermissions(){
    this.http.get(this.rootUrl + "/permissions").subscribe((_res)=>{
      console.log(_res)
      return _res
    })
  }
}
