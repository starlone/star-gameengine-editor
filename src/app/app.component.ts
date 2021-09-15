import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Factory, GameObject, KeyboardHandler, PlataformPlayerScript, StarEngine, Scene } from 'star-gameengine';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'star-gameengine-editor';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  scene: any;
  selected?: GameObject
  player?: GameObject;
  isPlaying = false;
  engine?: StarEngine;

  constructor(private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit() {
    this.inicialContent();
  }

  select(item: any) {
    this.selected = item;
  }

  inicialContent() {
    this.scene = new Scene();

    this.engine = new StarEngine("canvas", this.scene);
    const handler = new KeyboardHandler(this.engine.getJoystick());
    console.log(handler);

    this.engine.disable();

    var terrain = Factory.rect({
      'name': 'terrain', 'x': 500, 'y': 500, 'w': 800, 'h': 30, static: true
    });
    this.scene.add(terrain);

    var ghost = Factory.rect({
      'name': 'ghost', 'x': 500, 'y': 300, 'w': 800, 'h': 30, static: true, hasRigidBody: false
    });
    this.scene.add(ghost);

    this.player = Factory.rect({
      'name': 'obj1', 'x': 300, 'y': 30, 'w': 30, 'h': 30, 'color': 'green'
    });
    this.scene.add(this.player);

    var script = new PlataformPlayerScript(this.player, this.engine.getJoystick(), 1);
    this.player.addScript(script);

    this.engine.start();
  }

  play() {
    if (!this.engine)
      return;
    if (this.isPlaying) {
      this.engine.disable();
    } else {
      this.engine.enable();
    }
    this.isPlaying = this.engine.isEnabled();
  }

}
