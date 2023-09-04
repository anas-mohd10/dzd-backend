import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { DynamicScriptsService } from 'src/app/includes/services/dynamic-scripts.service';

@Component({
  selector: 'app-dynamic-scripts',
  templateUrl: './dynamic-scripts.component.html',
  styleUrls: ['./dynamic-scripts.component.scss']
})
export class DynamicScriptsComponent implements OnInit {
  appRoute = appRoutes
  scriptDetails: any = {}
  code = 'console.log("Hello, World!");';

  editorOptions = {
    theme: 'vs-dark', // or 'vs-light'
    language: 'javascript', // specify the language mode
  };

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private DynamicScriptsService: DynamicScriptsService,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.DynamicScriptsService.getScriptDetails().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.scriptDetails = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

}
