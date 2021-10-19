import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  Factory,
  GameObject,
  KeyboardHandler,
  PlataformPlayerScript,
  Scene,
  StarEngine,
  ZoomInteraction,
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
  engineEdit?: StarEngine;
  enginePlay?: StarEngine;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.inicialContent();
  }

  ngAfterViewInit(): void {
    this.engineEdit?.start();
  }

  select(item: any) {
    this.selected = item;
  }

  inicialContent() {
    this.engineEdit = new StarEngine('#canvasedit', this.scene);
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

    this.engineEdit?.getViewport()?.addInteraction(new ZoomInteraction());
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
