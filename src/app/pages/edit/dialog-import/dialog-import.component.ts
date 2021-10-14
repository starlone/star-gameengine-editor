import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-import',
  templateUrl: './dialog-import.component.html',
  styleUrls: ['./dialog-import.component.scss'],
})
export class DialogImportComponent {
  srcResult: any;

  @ViewChild('autosize') autosize?: CdkTextareaAutosize;

  constructor(
    private _ngZone: NgZone,
    private dialogRef: MatDialogRef<DialogImportComponent>
  ) {}

  onFileSelected() {
    const inputNode: any = document.querySelector('#inputfile');
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };

      reader.readAsText(inputNode.files[0]);
    }
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize?.resizeToFitContent(true));
  }
  import() {
    const json = JSON.parse(this.srcResult);
    this.dialogRef.close(json);
  }
}
