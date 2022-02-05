import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Factory, IFactoryOptions } from 'star-gameengine';

@Component({
  selector: 'app-dialog-newcircle',
  templateUrl: './dialog-newcircle.component.html',
  styleUrls: ['./dialog-newcircle.component.scss'],
})
export class DialogNewcircleComponent {
  formName = new FormControl('', [Validators.required]);

  params: IFactoryOptions = {
    name: '',
    x: 0,
    y: 0,
    radius: 20,
    maxSides: 25,
    color: 'green',
    angle: 0,
    rigidBody: {},
    static: true,
  };
  constructor(private dialogRef: MatDialogRef<DialogNewcircleComponent>) {}

  create() {
    this.params.name = this.formName.value;
    if (!this.params.name) return;
    const obj = Factory.circle(this.params);
    this.dialogRef.close(obj);
  }
}
