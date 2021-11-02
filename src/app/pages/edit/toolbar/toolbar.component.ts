import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Scene, StarEngine } from 'star-gameengine';
import { DialogImportComponent } from '../dialogs/dialog-import/dialog-import.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() scene?: Scene;
  @Input() engineEdit?: StarEngine;
  @Input() isPlaying?: boolean;

  @Output() onPlay: EventEmitter<void> = new EventEmitter();
  @Output() onSideLeft: EventEmitter<void> = new EventEmitter();
  @Output() onSideRight: EventEmitter<void> = new EventEmitter();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {}

  export() {
    const json = JSON.stringify(this.scene);
    var blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    saveAs(blob);
  }

  import() {
    const dialogRef = this.dialog.open(DialogImportComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newscene = new Scene(result);
        this.engineEdit?.setScene(newscene);
        this.scene = newscene;
      }
    });
  }

  newObject() {
    alert('oi');
  }
}
