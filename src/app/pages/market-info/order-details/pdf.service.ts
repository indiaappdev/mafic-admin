import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient) {}

  fetchHtml(filePath: string): Observable<string> {
    return this.http.get(filePath, { responseType: 'text' });
  }

  generatePdfFromHtml(htmlContent: string): void {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    document.body.appendChild(div);

    html2canvas(div).then((canvas) => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('converted.pdf');

      document.body.removeChild(div);
    });
  }
}
