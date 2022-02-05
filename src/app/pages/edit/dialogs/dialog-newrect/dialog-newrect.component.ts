import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Factory, IFactoryOptions } from 'star-gameengine';

@Component({
  selector: 'app-dialog-newrect',
  templateUrl: './dialog-newrect.component.html',
  styleUrls: ['./dialog-newrect.component.scss'],
})
export class DialogNewrectComponent {
  formName = new FormControl('', [Validators.required]);

  params: IFactoryOptions = {
    name: '',
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    color: 'green',
    angle: 0,
    rigidBody: {},
    static: true,
  };
  constructor(private dialogRef: MatDialogRef<DialogNewrectComponent>) {}

  create() {
    this.params.name = this.formName.value;
    if (!this.params.name) return;
    const obj = Factory.rect(this.params);
    this.dialogRef.close(obj);
  }
}
