import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Bodies, Engine, Render, World, Runner } from 'matter-js';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Factory, FreeMoveScript, KeyboardHandler, StarEngine } from 'star-gameengine';

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

  constructor(private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit() {
    this.inicialContent();
  }

  inicialContent() {
    const se = new StarEngine("canvas");

    var scene = se.getScene();

    var terrain = Factory.rect({
      'name': 'terrain', 'x': 500, 'y': 500, 'w': 800, 'h': 30
    });
    scene.add(terrain);

    var player = Factory.rect({
      'name': 'obj1', 'x': 300, 'y': 30, 'w': 30, 'h': 30, 'color': 'green'
    });
    scene.add(player);
    var script = new FreeMoveScript(player, se.getJoystick(), 1);
    player.addScript(script);

    const handler = new KeyboardHandler(se.getJoystick());
    console.log(handler);

    se.start();
  }

}
