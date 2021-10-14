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

    this.scene.getCamera()?.position.change(0, 300);
  }

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
}
