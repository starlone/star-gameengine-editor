import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Factory } from 'star-gameengine';
import { IFactoryOptions } from 'star-gameengine/dist/options/factory.options';

@Component({
  selector: 'app-dialog-newcircle',
  templateUrl: './dialog-newcircle.component.html',
  styleUrls: ['./dialog-newcircle.component.scss'],
})
export class DialogNewcircleComponent {
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
    const obj = Factory.circle(this.params);
    this.dialogRef.close(obj);
  }
}
