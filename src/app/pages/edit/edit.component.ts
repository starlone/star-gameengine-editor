import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DialogImportComponent } from 'src/app/dialogs/dialog-import/dialog-import.component';
import {
  Factory,
  GameObject,
  KeyboardHandler,
  PlataformPlayerScript,
  Scene,
  StarEngine,
} from 'star-gameengine';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  title = 'star-gameengine-editor';

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  treeControl = new NestedTreeControl<GameObject>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<GameObject>();

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

    this.player = Factory.rect({
      name: 'obj1',
      x: 0,
      y: 0,
      w: 30,
      h: 30,
      color: 'green',
    });
    this.scene.add(this.player);

    const teste = Factory.rect({
      name: 'obj1',
      x: 0,
      y: 0,
      w: 30,
      h: 30,
      color: 'green',
    });
    this.player.children.push(teste);

    var terrain = Factory.rect({
      name: 'terrain',
      x: 0,
      y: 300,
      w: 800,
      h: 30,
      static: true,
    });
    this.scene.add(terrain);

    this.player.addScript(new PlataformPlayerScript({ speed: 1 }));

    this.engineEdit.start();

    this.scene.getCamera()?.position.change(0, 300);

    this.dataSource.data = this.scene.objs;
  }

  hasChild = (_: number, node: GameObject) => !!node.children && node.children.length > 0;

  play() {
    if (!this.engineEdit) return;
    if (this.isPlaying) {
      this.enginePlay?.disable();
      this.enginePlay?.stop();
    } else {
      const newscene = this.scene.clone();
      this.enginePlay = new StarEngine('#canvasplay', newscene);
      const handler2 = new KeyboardHandler(this.enginePlay.getJoystick());
      console.log(handler2);
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newscene = new Scene(result);
        this.engineEdit?.setScene(newscene);
        this.scene = newscene;
      }
    });
  }
}
