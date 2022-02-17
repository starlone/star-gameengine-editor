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
import { GameService } from './services/game.service';

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

  player?: GameObject;
  isPlaying = false;
  engineEdit: StarEngine;
  enginePlay?: StarEngine;
  loading = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private gameService: GameService
  ) {
    const scene = this.gameService.getScene();
    this.engineEdit = new StarEngine('#canvasedit', scene);
    this.inicialContent();
  }

  ngAfterViewInit(): void {
    this.engineEdit?.start();
  }

  inicialContent() {
    KeyboardHandler.add(this.engineEdit.getJoystick());

    this.engineEdit.disable();

    this.player = Factory.rect({
      name: 'player',
      x: 0,
      y: 0,
      w: 40,
      h: 40,
      color: 'green',
      rigidBody: {},
    });

    const scene = this.gameService.getScene();
    scene.add(this.player);

    const eye = Factory.rect({
      name: 'player_eye',
      x: 5,
      y: -2,
      w: 10,
      h: 10,
      color: 'blue',
    });
    this.player.addChild(eye);

    var terrain = Factory.rect({
      name: 'terrain',
      x: 0,
      y: 200,
      w: 800,
      h: 30,
      static: true,
      rigidBody: {},
    });
    scene.add(terrain);

    this.player.addScript(new PlataformPlayerScript({ speed: 0.4 }));

    const viewport = this.engineEdit.getViewport();

    this.gameService.addInteractions(viewport);
  }

  play() {
    this.gameService.deselect();
    if (!this.engineEdit) return;
    if (this.isPlaying) {
      this.enginePlay?.disable();
      this.enginePlay?.stop();
    } else {
      const newscene = this.gameService.getScene().clone();
      this.enginePlay = new StarEngine('#canvasplay', newscene);
      KeyboardHandler.add(this.enginePlay.getJoystick());
      this.enginePlay.start();
    }
    this.isPlaying = !this.isPlaying;
  }

  import(data: any) {
    this.loading = true;
    const newscene = new Scene(data);
    this.engineEdit?.setScene(newscene);
    this.gameService.setScene(newscene);
    // Force reload panel-objects-tree.component
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
}
