import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  Factory,
  GameObject,
  KeyboardHandler,
  PanInteraction,
  PlataformPlayerScript,
  Scene,
  SelectObjectInteraction,
  StarEngine,
  ZoomInteraction
} from 'star-gameengine';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements AfterViewInit {
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
  engineEdit: StarEngine;
  enginePlay?: StarEngine;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.engineEdit = new StarEngine('#canvasedit', this.scene);
    this.inicialContent();
  }

  ngAfterViewInit(): void {
    this.engineEdit?.start();
  }

  select(item: any) {
    this.selected = item;
  }

  inicialContent() {
    KeyboardHandler.add(this.engineEdit.getJoystick());

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

    var terrain = Factory.rect({
      name: 'terrain',
      x: 0,
      y: 200,
      w: 800,
      h: 30,
      static: true,
    });
    this.scene.add(terrain);

    this.player.addScript(new PlataformPlayerScript({ speed: 1 }));

    const viewport = this.engineEdit.getViewport();

    viewport.addInteraction(new ZoomInteraction());
    viewport.addInteraction(
      new SelectObjectInteraction((coordinate: any) => {
        const obj = this.scene.getObjectByCoordinate(coordinate);
        this.select(obj);
      })
    );
    const panControl = {
      target: this.scene.getCamera(),
      isInverse: true,
    };
    const startPan = (point: any) => {
      const obj = this.scene.getObjectByCoordinate(point);
      if (obj && this.selected && obj === this.selected) {
        panControl.target = obj;
        panControl.isInverse = false;
      } else {
        panControl.target = this.scene.getCamera();
        panControl.isInverse = true;
      }
    };
    const endPan = () => {
      panControl.target = this.scene.getCamera();
      panControl.isInverse = true;
    };
    const movePan = (point: any) => {
      if (panControl.isInverse) {
        point.neg();
      }
      panControl.target.position.move(point.x, point.y);
    };
    viewport.addInteraction(new PanInteraction(startPan, endPan, movePan));
  }

  play() {
    if (!this.engineEdit) return;
    if (this.isPlaying) {
      this.enginePlay?.disable();
      this.enginePlay?.stop();
    } else {
      const newscene = this.scene.clone();
      this.enginePlay = new StarEngine('#canvasplay', newscene);
      KeyboardHandler.add(this.enginePlay.getJoystick());
      this.enginePlay.start();
    }
    this.isPlaying = !this.isPlaying;
  }
}
