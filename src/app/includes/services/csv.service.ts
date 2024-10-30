import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { csvEndpoints, customerEndpoints } from 'src/app/config/endpoints';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  customerEndpoints = customerEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }


  downloadUsers(data: any): Observable<Blob> {
    const url = this.commonService.getFullUrl(this.customerEndpoints.download_customers);
    return this.http.post(`${url}`, data, { responseType: 'blob' })
  }

  csvDownload(headers: any, data: any, name: any) {
    if (!data || !data.length) {
      return
    }

    let seperator = ','
    let content: any = headers.join(seperator) + '\n' + data.map((val: any) => {
      return headers.map((key: any) => {
        return val[key.toLowerCase().replaceAll(' ', '_')] ===
          null || val[key.toLowerCase().replaceAll(' ', '_')] === undefined ? '' : val[key.toLowerCase().replaceAll(' ', '_')]
      }).join(seperator)
    }).join('\n')
    this.exportFile(content, 'text/csv', name)
  }

  exportFile(content: any, fileType: any, name: any) {
    let blob = new Blob([content], { type: fileType })
    FileSaver.saveAs(blob, name)
  }


  getFileImports(query: any) {
    const url = this.commonService.getFullUrl(csvEndpoints.fileImports);
    return this.http.post(`${url}`, query)
  }

  getFileImportDetails(uploadId:string) {
    const url = this.commonService.getFullUrl(csvEndpoints.fileImport + `/${uploadId}`);
    return this.http.get(`${url}`)
  }

  downloadImportLog(fileId: string){
    const url = this.commonService.getFullUrl(csvEndpoints.downloadImportLog + `/${fileId}`);
    return this.http.get(`${url}`)
  }
}
