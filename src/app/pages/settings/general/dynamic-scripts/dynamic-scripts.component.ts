import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  editorOptions = { theme: 'vs-dark', language: 'html' };
  code: string = '<script>\n\tfunction helloWorld() {\n\t\tconsole.log("Hello world!");\n\t}\n</script>';

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private DynamicScriptsService: DynamicScriptsService,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.DynamicScriptsService.getScriptDetails().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.code = res?.result?.script
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
  
  manageScriptDetails() {
    this.DynamicScriptsService.manageScript({ script: this.code }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ngOnInit()
        this.ToastrService.success(res?.message)
      } else {
        this.ToastrService.error(res?.message)
      }
    })
  }
}
