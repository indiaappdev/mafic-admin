import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-product-terms-add',
  templateUrl: './view-product-terms-add.component.html',
  styleUrls: ['./view-product-terms-add.component.css']
})
export class ViewProductTermsAddComponent implements OnInit {
  fileUrl: SafeResourceUrl; // Change to SafeResourceUrl
  fileType: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<ViewProductTermsAddComponent>, 
    private sanitizer: DomSanitizer // Inject DomSanitizer
  ) {
    this.fileType = this.getFileType(data.fileUrl);
    this.fileUrl = this.sanitizeUrl(data.fileUrl); // Sanitize the URL
  }

  ngOnInit(): void {}

  getFileType(fileUrl: string): string {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return 'pdf';
    } else if (['jpeg', 'jpg', 'png'].includes(extension!)) {
      return 'image';
    }
    return 'unknown';
  }

  // Sanitize the URL
  sanitizeUrl(fileUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  // Close the specific dialog (ViewProductTermsAddComponent)
  closepopup() {
    this.dialogRef.close(); // Close only this dialog
  }
}
