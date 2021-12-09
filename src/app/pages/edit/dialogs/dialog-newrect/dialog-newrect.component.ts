import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Factory } from 'star-gameengine';
import { IFactoryOptions } from 'star-gameengine/dist/options/factory.options';

@Component({
  selector: 'app-dialog-newrect',
  templateUrl: './dialog-newrect.component.html',
  styleUrls: ['./dialog-newrect.component.scss'],
})
export class DialogNewrectComponent {
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
    const obj = Factory.rect(this.params);
    this.dialogRef.close(obj);
  }
}
