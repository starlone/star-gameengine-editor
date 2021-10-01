import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  Factory,
  GameObject,
  KeyboardHandler,
  PlataformPlayerScript,
  Scene,
  StarEngine
} from 'star-gameengine';
import { DialogImportComponent } from './dialogs/dialog-import/dialog-import.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'star-gameengine-editor';

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  scene: Scene = new Scene();
  selected?: GameObject;
  player?: GameObject;
  isPlaying = false;
  engineEdit?: StarEngine;
  enginePlay?: StarEngine;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.inicialContent();
  }

  select(item: any) {
    this.selected = item;
  }

  inicialContent() {
    this.engineEdit = new StarEngine('#canvasedit', this.scene);
    const handler = new KeyboardHandler(this.engineEdit.getJoystick());
    console.log(handler);

    this.engineEdit.disable();

    var terrain = Factory.rect({
      name: 'terrain',
      x: 500,
      y: 500,
      w: 800,
      h: 30,
      static: true,
    });
    this.scene.add(terrain);

    this.player = Factory.rect({
      name: 'obj1',
      x: 300,
      y: 30,
      w: 30,
      h: 30,
      color: 'green',
    });
    this.scene.add(this.player);

    var script = new PlataformPlayerScript(
      this.player,
      this.engineEdit.getJoystick(),
      1
    );
    this.player.addScript(script);

    this.engineEdit.start();
  }

  play() {
    if (!this.engineEdit) return;
    if (this.isPlaying) {
      this.engineEdit.disable();
    } else {
      const newscene = this.scene.clone();
      this.enginePlay = new StarEngine('#canvasplay', newscene);
      this.enginePlay.start();
    }
    this.isPlaying = !this.isPlaying;
  }

  export() {
    const json = JSON.stringify(this.scene);
    var blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    saveAs(blob);
  }

  import() {
    const dialogRef = this.dialog.open(DialogImportComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
