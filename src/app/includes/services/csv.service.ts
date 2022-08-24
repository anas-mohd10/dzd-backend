import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver'

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }

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
}
